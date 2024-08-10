import { useState } from 'react';
import { Amplify } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import { get } from 'aws-amplify/api';
import '@aws-amplify/ui-react/styles.css';
import config from './amplifyconfiguration.json';

Amplify.configure(config);

function App({ signOut, user }) {
    const [counter, setCounter] = useState(0); // Initialize counter state

    async function incrementCounter() {
        try {
            const restOperation = get({
                apiName: 'apitestgateway',
                path: '/counter',
                options: {
                    queryParams: {
                        counter: `${counter}`
                    }
                }
            });
            const response = await restOperation.response;
            const data = await response.body.json();
            const fetchedCount = data.counter

            setCounter(fetchedCount)
            console.log('GET call succeeded: ', response);
        } catch (e) {
            console.log('GET call failed: ', JSON.parse(e));
        }
    }

    return (
        <>
            <h1>Hello {user.username}</h1>
            <button onClick={signOut}>Sign out</button>

            <div>
                <h2>Counter: {counter}</h2> {/* Display the current counter value */}
                <button onClick={incrementCounter}>Increment Counter</button> {/* Increment counter button */}
            </div>
        </>
    );
}

const AppWithAuthenticator = withAuthenticator(App);

export default AppWithAuthenticator;
