import Command from '@sharpcli/command'

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
    console.log(params)
  }
}

function Install(instance) { 
  return new InstallCommand(instance)
}
export default Install