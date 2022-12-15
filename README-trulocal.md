1. Open a terminal and go to the directory where you will store the trulocal-cornerstone source code
2. Enter `git clone https://github.com/truLOCAL/cornerstone.git`
3. Proceed into the cloned directory `cd cornerstone`
4. Install the specified version of nvm, then install the bigcommerce stencil-cli node library by following the
directions for your system in the link provided:
https://developer.bigcommerce.com/stencil-docs/003c4b2e8108c-installing-stencil-cli
5. `git checkout development`
6. Next you will need to get a Stencil-CLI API token from an administrator.
Replace "<api_token>" in the following command and run:
`stencil init --url https://trulocal-sandbox.mybigcommerce.com --token <api_token>`
7. `npm install @stencil/webpack`
   1. This step should be able to be skipped after 
8. `stencil start`

In the Future, you should be able to run stencil by simply running the following commands:
1. Open a terminal and go to the cornerstore directory that is the git source code
2. `nvm use 14`
3. `stencil start`

