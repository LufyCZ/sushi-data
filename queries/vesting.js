const pageResults = require('graph-results-pager');

const { request, gql } = require('graphql-request');

const { graphAPIEndpoints } = require('./../constants');
const { timestampToBlock } = require('./../utils');

module.exports = {
    async user({block = undefined, timestamp = undefined, user_address = undefined} = {}) {
        if(!user_address) { throw new Error("sushi-data: User address undefined"); }

        block = block ? block : timestamp ? (await timestampToBlock(timestamp)) : undefined;
        block = block ? `block: { number: ${block} }` : "";

        const result = await request(graphAPIEndpoints.vesting,
            gql`{
                user(id: "${user_address.toLowerCase()}", ${block}) {
                    ${users.properties.toString()}
                }
            }`
        );

        return users.callback([result.user])[0];
    },

    async users({block = undefined, timestamp = undefined} = {}) {
        return pageResults({
            api: graphAPIEndpoints.vesting,
            query: {
                entity: 'users',
                selection: {
                    block: block ? { number: block } : timestamp ? { number: await timestampToBlock(timestamp) } : undefined,
                },
                properties: users.properties
            }
        })
            .then(results => users.callback(results))
            .catch(err => console.log(err));
    },

    async week({block = undefined, timestamp = undefined, week = undefined} = {}) {
        if(!week) { throw new Error("sushi-data: Week number undefined"); }

        block = block ? block : timestamp ? (await timestampToBlock(timestamp)) : undefined;
        block = block ? `block: { number: ${block} }` : "";

        const result = await request(graphAPIEndpoints.vesting,
            gql`{
                week(id: "${week}", ${block}) {
                    ${weeks.properties.toString()}
                }
            }`
        );

        return weeks.callback([result.week])[0];
    },

    async weeks({block = undefined, timestamp = undefined} = {}) {
        return pageResults({
            api: graphAPIEndpoints.vesting,
            query: {
                entity: 'weeks',
                selection: {
                    block: block ? { number: block } : timestamp ? { number: await timestampToBlock(timestamp) } : undefined,
                },
                properties: weeks.properties
            }
        })
            .then(results => weeks.callback(results))
            .catch(err => console.log(err));
    }
}

const users = {
    properties: [
        'id',
        'claims { id, week, amount }',
        'totalClaimed'
    ],

    callback(results) {
        return results.map(result => ({
            id: result.id,
            claims: result.claims.map(claim => ({
                id: claim.id,
                week: Number(claim.week),
                amount: Number(claim.amount)
            })),
            totalClaimed: Number(result.totalClaimed)
        }));
    }
}

const weeks = {
    properties: [
        'id',
        'numberOfClaims',
        'totalClaimed',
        'merkleRoot'
    ],

    callback(results) {
        return results.map(result => ({
            id: Number(result.id),
            numberOfClaims: Number(result.numberOfClaims),
            totalClaimed: Number(result.totalClaimed),
            merkleRoot: result.merkleRoot,
        }));
    }
}