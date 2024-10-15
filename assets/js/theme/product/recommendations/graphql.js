import request from './http';

export default function gql(query, variables, token) {
    return request('POST', '/graphql', JSON.stringify({ query, variables }), {
        'Content-Type': 'application/json',
        // eslint-disable-next-line quote-props
        Authorization: `Bearer ${token}`,
    });
}
