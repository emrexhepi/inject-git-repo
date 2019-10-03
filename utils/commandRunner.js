const shell = require('shelljs');

const commandRunner = (
        command = '',
        errorMessag = '',
        exitOnError = true,
        options = {}
    ) => {
        
    shell.echo(`Running: ${command}`);
    
    const output = shell.exec(
        command,
        options
    );
    
    if(output.code !== 0) {
        shell.echo(
            errorMessag || `Error: ${command} <- failed!`
        );
    }

    if (output.code !== 0 && exitOnError) {
        shell.exit(1);
        return null;
    }

    return output;
}

module.exports = commandRunner;