import { useState } from 'react';
import { Amplify } from 'aws-amplify';
import {withAuthenticator, WithAuthenticatorProps} from '@aws-amplify/ui-react';
import { get } from 'aws-amplify/api';
import '@aws-amplify/ui-react/styles.css';
import config from './amplifyconfiguration.json';

Amplify.configure(config);



function App({ signOut, user }: WithAuthenticatorProps) {
    const [counter, setCounter] = useState(0);

    console.log(user)
    console.log(typeof user)

    interface CounterResponse {
        counter: number;
    }

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
            const data = await response.body.json() as CounterResponse | null;
            if (data) {
                const fetchedCount: number = data.counter;
                setCounter(fetchedCount);
                console.log('GET call succeeded: ', fetchedCount);
            } else {
                console.log('wrong data received')
            }
        } catch (e) {
            if (e instanceof Error) {
                console.log('GET call failed: ', e.message);
            } else {
                console.log('GET call failed with unknown error');
            }
        }
    }

    return (
        <>
            <h1>Hello {user?.username}</h1>
            <button onClick={signOut}>Sign out</button>

            <div>
                <h2>Counter: {counter}</h2>
                <button onClick={incrementCounter}>Increment Counter</button>
            </div>
        </>
    );
}

const AppWithAuthenticator = withAuthenticator(App);

export default AppWithAuthenticator;
