class UnitTester {

    static Test = ( testName, testFunction ) => {
        console.log( `Test: ${ testName } start` );
        testFunction();
        console.log( `Testt ${ testName } passed` );
    }

    static AssertObjectEqual = ( expected, actual ) => {

        if ( typeof expected !== 'object' ) {
            console.assert( false, `AssertObjectEqual failed, expected is not object` );
            return false;
        }

        if ( typeof actual !== 'object' ) {
            console.assert( false, `AssertObjectEqual failed, actual is not object` );
            return false;
        }

        const expectedKeys = Object.keys( expected );
        const actualKeys = Object.keys( actual );

        if ( expectedKeys.length !== actualKeys.length ) {
            console.assert( false, `AssertObjectEqual failed, expectedKeys.length !== actualKeys.length` );
            return false;
        }

        for ( let i = 0; i < expectedKeys.length; i++ ) {

            const expectedKey = expectedKeys[i];
            const actualKey = actualKeys[i];

            if ( expectedKey !== actualKey ) {
                console.assert( false, `AssertObjectEqual failed, expectedKey !== actualKey` );
                return false;
            }

            const expectedValue = expected[expectedKey];
            const actualValue = actual[actualKey];

            if ( typeof expectedValue === 'object' ) {

                if ( UnitTester.AssertObjectEqual( expectedValue, actualValue ) === false ) {
                    console.assert( false, `AssertObjectEqual failed, AssertObjectEqual(expectedValue, actualValue) === false` );
                    return false;
                }

            } else {

                if ( expectedValue !== actualValue ) {
                    console.assert( false, `AssertObjectEqual failed, expectedValue (${ expectedValue }) !== actualValue (${ actualValue }) ` );
                    return false;
                }

            }

        }

        return true;

    }

    static AssertArrayEqual = ( expected, actual ) => {
        const methodName = 'AssertArrayEqual';

        if ( expected.length !== actual.length ) {
            return false;
        }

        for ( let i = 0; i < expected.length; i++ ) {

            // if expected[i] is object
            if ( typeof expected[i] === 'object' ) {
                if ( UnitTester.AssertObjectEqual( expected[i], actual[i] ) === false ) {
                    console.assert( false, `${ methodName } failed at index ${ i }` );
                    return false;
                }

                continue;
            }

            if ( expected[i] !== actual[i] ) {
                console.assert( false, `${ methodName } failed at index ${ i }` );
                return false;
            }
        }
    }

}
