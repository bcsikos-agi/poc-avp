const index = require('./index')

index.handler({
    headers: {
        authorization: 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImpGcU00MENldDRoSk9yeXk0WTdCeSJ9.eyJpc3MiOiJodHRwczovL2Rldi14ejM3MDQzcC5ldS5hdXRoMC5jb20vIiwic3ViIjoiYXV0aDB8NjNmNzU5Yzc2YmRiNTM1MDA0NjhhMzY2IiwiYXVkIjpbImh0dHBzOi8vdHZ6Z3Boa255ZC5leGVjdXRlLWFwaS51cy1lYXN0LTEuYW1hem9uYXdzLmNvbS8iLCJodHRwczovL2Rldi14ejM3MDQzcC5ldS5hdXRoMC5jb20vdXNlcmluZm8iXSwiaWF0IjoxNjc4MDk4MjQ2LCJleHAiOjE2NzgxODQ2NDYsImF6cCI6IkM3bklGb0wzZDAyeUcwam5rYk1aM0l3Nk00eG1HOE01Iiwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCJ9.sQbI7AZf8_0T5x-o6OZhtELkCyMb_xtFFIbpTPwJXaQslumrWrhTEqg-EA3ZnmsYbKbvYKK391vtg2S7U4RWKhswqgQmTD-svuDNGGfqTFh5f3OZPxOydGWyuY6JaxF6M8i0LMS-KURjAWeVw4ZbRBNy_Y9zsd6Ff5z3vIx2z0MTFs9SLyA_7p5iqtlz-A4kUpcXGqLSDDvsKqanpyQ1yBro94bjeiMYceAWwHTTqCnsA9ASWeVhhFHVnKCfaCeP0N45DTWy-N0JiwFawJEU3CN_eD0EYzecs9aNqDpqNxEQMNEMcoERn2qjfoGtszXeGPNLevW0hoFaEeuC_NP8JA'
    },
    requestContext: {
        http: {
            method: 'GET',
            path: '/user'
        }
    }

}).then(ret => console.log(ret))