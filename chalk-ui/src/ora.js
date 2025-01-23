import ora from 'ora';

const spinner = ora('加载中...').start()

let present = 0;

spinner.color = 'yellow';
spinner.text = '加载中...';
spinner.prefixText = 'Downloading';

let interval =  setInterval(() => {
  present += 10;
  spinner.text = `加载中...${present}%`;
  if (present === 100) { 
    spinner.stop();
    spinner.succeed('加载完成');
    clearInterval(interval);
  }

}, 1000);