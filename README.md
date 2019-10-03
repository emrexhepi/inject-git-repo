# inject-git-repo
A tool that injects a repo to ./src/core folder or to another prespecified folder

### Usage
1. Install 'npm install --save-dev inject-git-repo`
2. Create .env (if it does not exist)
3. Add `INJECT_REPO=...` - replace `...` with your repo;
4. Add `INJECT_REPO_BRANCH=...` - replace `...` with your prefered repo branch;
5. On your package.json at the "scripts" part add `"prestart": "inject-git-repo"` and `"prebuild": "inject-git-repo"`;
6. You are ready to go every time you build or start your project it will clone or pull from the INJECT_REPO;


### Done
 - Add submodule
 - Add branch 
 - update functionality

### TODO
 - Remove submodule functionality