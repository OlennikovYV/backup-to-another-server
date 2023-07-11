# Надуманное приложение для копирования файлов копий с сервера на ПК для хранения копий

## Как использовать приложение

- Создать папку, например `d:\runbackup`
- Скопировать папки `tasks`, `utils` и файл `app.js` из проекта в `d:\runbackup`
- Создать в `d:\runbackup\run.bat` файл с содержимым:

```bat
1 cd d:\runbackup
2 C:\Windows\System32\cmd.exe /c "C:\Program Files\nodejs\node.exe" d:\runbackup\app.js
3 timeout 15
```

- В **Планировщике заданий** создать задание с **действием** запуск программы и указать `run.bat` файл

## Используемый стэк в приложении

- **[Node]** - программная платформа, основанная на движке V8, превращающая **JavaScript** из узкоспециализированного языка в язык общего назначения ([1](https://ru.wikipedia.org/wiki/Node.js))

## Неиспользуемые функции, можно удалить

> zipFile - архивирование файла c помощью `zlib`
> 
> zipFileAdm - архивирование файла c помощью `adm-zip`

## License

MIT **Free Software, Hell Yeah!**

[Node]: https://nodejs.org
