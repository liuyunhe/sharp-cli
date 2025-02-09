import Command from '@sharpcli/command'
import { log, makeList, Github, getGitPlatform } from '@sharpcli/utils'

class InstallCommand extends Command {
  get command() {
    return 'install'
  }

  get description() {
    return 'install project'
  }

  get options() {
    return [
      // ['-d, --dev', 'install dev dependencies'],
      // ['-g, --global', 'install global package'],
    ]
  }

  async action(params) {
    let platform = getGitPlatform()
    if (!platform) { 
      platform = await makeList({
        choices: [
          {
            name: 'Github',
            value: 'github'
          },
          {
            name: 'Gitee',
            value: 'gitee'
          }
        ],
        message: '请选择git平台'
      })
    }
    let gitAPI
    if (platform === 'github') {
      gitAPI = new Github()
    } else { 

    }
    gitAPI.savePlatform(platform)
    await gitAPI.init()
    
  }
}

function Install(instance) {
  return new InstallCommand(instance)
}
export default Install
