export async function graphqlDemoGet() {
    const baseApiUrl = '/graphql/execute.json';
    const projectId = 'aem-demo-assets';
    const queryName = 'articles-all';
    const queryParams = ''; // Adjust if needed, e.g., '?param=value'
    const graphqlEndpoint = `${baseApiUrl}/${projectId}/${queryName}${queryParams}`;
  
    // Make the GET request to the GraphQL endpoint without authentication headers
    return fetch(graphqlEndpoint, {
        method: 'GET',
    }).then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    }).then(data => {
        return data; // Ensure to return the data so that the promise resolves with it
    }).catch(error => {
        console.error('Error fetching data: ', error);
        throw error; // Rethrow or handle the error as appropriate
    });
}