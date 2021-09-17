import * as path from "path"
import express from "express"
import {graphqlHTTP} from "express-graphql"
import chokidar from "chokidar"
import {GraphQLBoolean, GraphQLObjectType, GraphQLSchema, GraphQLString} from "graphql"
import {interpret} from "xstate"
import lodash from "lodash"
import createTypes from "./create-types"
import {PubSub} from "graphql-subscriptions"
import {v4 as uuidv4} from "uuid"
import recipeMachine from "gatsby-recipes/src/recipe-machine"

const pubsub = new PubSub()

const app = express()

console.log('starting gatsby graphql server...')

const directory = path.resolve('.')

const OperationType = new GraphQLObjectType({
    name: `Operation`,
    fields: {
        state: {type: GraphQLString}
    }
})

const {queryTypes, mutationTypes} = createTypes()

const rootQueryType = new GraphQLObjectType({
    name: `Root`,
    fields: () => queryTypes
})

let lastState = {}
let lastDone = 0

const compareState = (oldState, newState) => {
    const newDone = newState.context.plan.filter(r => r.isDone).length
    const comparison = !lodash.isEqual(newState, oldState) || lastDone !== newDone
    lastDone = newDone

    return comparison
}

const emitUpdate = state => {
    const {lastEvent, ...cleanedState} = state
    if (compareState(lastState, cleanedState)) {
        pubsub.publish(`operation`, {
            state: JSON.stringify(cleanedState)
        })

        lastState = cleanedState
    }
}

let service
const startRecipe = ({recipePath, projectRoot, watchChanges = false}) => {
    const initialState = {
        context: {recipePath, projectRoot, steps: [], currentStep: 0},
        value: `init`
    }

    const startService = () => {
        service = interpret(
            recipeMachine.withContext(initialState.context)
        ).onTransition((state: any) => {
            if (state.event.type !== 'update') {
                console.log('===onTransition', {
                    state: state.value,
                    event: state.event.type
                })
            }

            if (state.changed) {
                console.log('===state.changed', {
                    state: state.value,
                    event: state.event.type
                })

                if (state.value === 'doneError') {
                    console.log(state.event)
                }

                if ([`presentPlan`, `done`, `doneError`, `applyingPlan`].includes(state.value)) {
                    emitUpdate({
                        context: state.context,
                        lastEvent: state.event,
                        value: state.value
                    })
                }
            }

            if (state.value === 'done') {
                service.stop()
            }
        })

        try {
            service.start()
        } catch (e) {
            console.log(`recipe machine failed to start`, e)
        }
    }

    if (watchChanges) {
        chokidar.watch(initialState.context.recipePath).on(`change`, () => {
            startService()
        })
    }

    startService()
}

const rootMutationType = new GraphQLObjectType({
    name: `Mutation`,
    fields: () => {
        return {
            ...mutationTypes,
            createOperation: {
                type: GraphQLString,
                args: {
                    recipePath: {type: GraphQLString},
                    projectRoot: {type: GraphQLString},
                    watchChanges: {type: GraphQLBoolean},
                },
                resolve: (_data, args: any) => {
                    console.log(`received operation`, args)
                    startRecipe(args)
                }
            },
            sendEvent: {
                type: GraphQLString,
                args: {
                    event: {type: GraphQLString},
                    input: {type: GraphQLString}
                },
                resolve: (_, args) => {
                    console.log('!!! event received', args)

                    service.send({
                        type: args.event,
                        data: args.input && JSON.parse(args.input)
                    })
                }
            }
        }
    }
})

const rootSubscriptionType = new GraphQLObjectType({
    name: `Subscription`,
    fields: () => {
        return {
            operation: {
                type: OperationType,
                subscribe: () => pubsub.asyncIterator(`operation`),
                resolve: payload => payload
            }
        }
    }
})

const schema = new GraphQLSchema({
    query: rootQueryType,
    mutation: rootMutationType,
    subscription: rootSubscriptionType
})

app.use(`/graphql`, graphqlHTTP({
    schema,
    graphiql: true,
    context: {root: directory}
}))

const sessionId = uuidv4()
app.use(`/session`, (req, res) => {
    res.send(sessionId)
})

app.use(`/service`, (req, res) => {
    res.json(service)
})


console.log('exiting...')
