# sakiewka-crypto

This is a library intended to be used as a dependency to other packages. It handles most of the wallet functionalities and communication with backend.

### Usage:

First run  `npm ci`

### Docs:
Run `npm run generate-docs`  
Open `/docs/index.html`

##### Tests: 
To run integration tests you have to specify `BACKEND_API_URL` in `.env` file.

`npm test` - Runs all tests  
`npm run test-unit` - Runs unit tests  
`npm run watch-test` - Runs tests in watch mode  
`npm run watch-test-unit` - Runs unit tests in watch mode

##### Build: 
`npm run build` - Builds files into dist/ folder  

##### Local api:  
`npm run serve` - Runs local server.  
`npm run serve-debug` - Runs local server in debug mode.  
`npm run watch-debug` - Runs local server and watches files for changes.  

### package.json modification:

Do not modify package.lock manually. Always use `npm install` when adding or updating packages.

### Design

There are two families of components: api and module.
Components from api family are used to provide unified access layer for our backend api.
Components from module family consits mostly of cryptographic functions which can be executed locally.