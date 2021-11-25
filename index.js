const product = require("./product.js");
const input = require("./input");

async function pressAnyKeyToContinue()
{
    return new Promise((resolve) => {
        console.log('Нажмите любую клавишу чтобы продолжить...');
        process.stdin.resume();
        process.stdin.setRawMode(true);
        process.stdin.once('data', () => {
            process.stdin.setRawMode(false);
            console.clear();
            resolve();
        });
    })
}

async function menu() {
    console.log(
        "*****************************\n" +
        "*        Меню выбора        *\n" +
        "*****************************\n" +
        "1. Вывести все товары\n" +
        "2. Добавить новый товар\n" +
        "3. Изменить существующий товар\n" +
        "4. Удалить товар\n" +
        "5. Выход\n"
    );
    return await input.get("Выберите команду:");
}

async function inputLoop() {
    console.clear();
    while (true)
    {
        const userChoice = await menu();
        switch (+userChoice) {
            case 1:
                await product.printAll();
                break;
            case 2:
                await product.add();
                break;
            case 3:
                await product.edit();
                break;
            case 4:
                await product.remove();
                break;
            case 5:
                return;
            default:
                console.error("Ошибочный ввод! Повторите попытку!");
                break;
        }
        await pressAnyKeyToContinue();
    }
}

inputLoop().then(() => {})

