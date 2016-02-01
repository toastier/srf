# FacultyRecruitmentSystem
Faculty Recruitment WebApp for DUSON

## Gulp
The gulp processes are pretty intricate, so here's an explanation of what is going on. Bare in mind that with gulp,
dependent tasks execute first, so you would need to read from bottom up to get the correct order of execution. Dependent 
tasks are denoted with surrounding pipe `|` characters. Tasks which have the same level of indentation will be run
asynchronously.

When running in `dev` mode (`gulp serve-dev`), everything is watched, so Jade and Sass will be transpiled, and
any changes made to the running codebase will either be injected into the browser via BrowserSync (which will make the
determination as to whether to reload the browser or not), or will cause nodemon to restart the server in the case of server 
app code changes.

`production` mode (`gulp serve-build`) is intended for testing and deploying.  The process concatenates js and css, 
obfuscates js, and writes the output, producing `./dist/js/app.js`, `./dist/js/lib.js`, `./dist/css/lib.css` and 
`./dist/css/app.css` files which are injected into `./dist/index.html` (which is the root html file in production mode).

### Main Tasks
#### Serve for Development
  - `serve-dev` (calls `serve(isDev, specRunner)` Fn with `isDev` =`true`)
    - |inject| (injects css files into ./src/index.html)
      - |wiredep| (gets the bower dependencies and injects them into ./src/index.html)
      - |dev-fonts| (copies fonts from bower dependencies to ./src/fonts/)
      - |styles| (transpiles custom sass to ./src/styles)
      - |templatecache| (creates an AngularJs $templateCache from all html partials and writes it to ./src/.tmp/)
        - |compile-jade| (compiles all .jade files in ./src to .html files in same directories)
          - |clean-code| (removes all js and html from ./dist and ./src/.tmp

#### Serve Build
  - `serve-build` (calls `serve(isDev, specRunner)` Fn with `isDev` =`false`)
    - |build-dist| (deletes `./src/.tmp`, logs, notifies)
      - |optimize| (concatenates js and css, obfuscates js, moves resultant files to `./dist`)
        - |inject| (injects css files into ./src/index.html)
              - |wiredep| (gets the bower dependencies and injects them into ./src/index.html)
              - |dev-fonts| (copies fonts from bower dependencies to ./src/fonts/)
              - |styles| (transpiles custom sass to ./src/styles)
              - |templatecache| (creates an AngularJs $templateCache from all html partials and writes it to ./src/.tmp/)
                - |compile-jade| (compiles all .jade files in ./src to .html files in same directories)
                  - |clean-code| (removes all js and html from ./dist and ./src/.tmp
      - |images| (compresses and copies images from `./src/img` to `./dist/img`)
        - |clean-images| (deletes from `./dist/img`)
      - |fonts| (copies fonts from `./src/fonts` to `./dist/fonts`) 
      
#### Vet Js
  - `vet-js` (vets Js code with JsHint and JSCS)
 
### Supporting Functions

#### `serve(isDev, specRunner) {...}`
  - calls `getNodeOptions(isDev)` Fn passing through the `isDev` value of its own invocation
  - runs nodemon with options from `getNodeOptions()`
  
#### `getNodeOptions(isDev) {...}`
  - sets `env.NODE_ENV` based on `isDev`.  'development' if `isDev` === true, else, 'production'
  - sets `env.PORT` based on config
  - sets `watch` = `config.server`

## Importing Legacy Data
[FRSLegacyDataMigration.md](FRSLegacyDataMigration.md)
