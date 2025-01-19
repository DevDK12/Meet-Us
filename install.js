const fs = require('fs');
const { exec } = require('child_process');
const yaml = require('js-yaml');

const runCommand = (command) => {
    return new Promise((resolve, reject) => {
        exec(command, (err, stdout, stderr) => {
            if (err) {
                reject(`Error: ${stderr}`);
            } else {
                resolve(stdout);
            }
        });
    });
};

const installPackages = async () => {
    try {
        const data = fs.readFileSync('requirements.yaml', 'utf8');

        const packages = yaml.load(data);

        if (packages.dep && packages.dep.length > 0) {
            const depCommand = `npm install --save ${packages.dep.join(' ')}`;
            const depResult = await runCommand(depCommand);
            console.log(`Regular dependencies installed successfully: ${depResult}`);
        }

        if (packages.dev && packages.dev.length > 0) {
            const devCommand = `npm install -D ${packages.dev.join(' ')}`;
            const devResult = await runCommand(devCommand);
            console.log(`Dev dependencies installed successfully: ${devResult}`);
        }
    } catch (error) {
        console.error('Error during installation:', error);
    }
};

installPackages();
