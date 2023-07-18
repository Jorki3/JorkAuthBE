import readline from "readline";
import fs from "fs";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Nombre del modelo:', (model) => {
    rl.close();

    const path = `models/${model}.js`

    fs.access(path, fs.constants.F_OK, (err) => {
        if (err) {
            console.log(`Creando el modelo ${model}`)

            const content = `import mongoose from 'mongoose';\n
const ${model}Schema = mongoose.Schema({}, {
    timestamps: true
});\n
const ${model} = mongoose.model('${model}', ${model}Schema);
export default  ${model};
`;

            fs.writeFileSync(path, content);
            console.log(`El modelo: ${model}, ha sido creado con exito.`);
            console.log(`${path}`);
        } else {
            console.log(`El modelo ${model} ya existe, favor de revisar.`);
            return;
        }
    })
});