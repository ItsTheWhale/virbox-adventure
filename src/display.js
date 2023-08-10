export class Display {
    Logs = {
        logs: [],
        computeLogsLength: function () {
            let logsLength = 0;
            for (let i in this.logs) {
                logsLength += (this.logs[i].text.match(/\<br\/\>/g) ?? [""]).length + 1;
            }
            return logsLength;
        },
        add: function (log) {
            console.log("Log " + log.text);
            this.logs.unshift(log);
            while (this.computeLogsLength() > 30) {
                this.logs.pop();
            }
            Game.Renderer.updateLogs();
        }
    }
}