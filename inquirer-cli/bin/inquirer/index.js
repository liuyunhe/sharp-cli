import inquirer from 'inquirer'

inquirer
  .prompt([
    /* Pass your questions in here */
    {
      type: 'confirm',
      name: 'confirm',
      message: 'Are you sure?',
      default: true
    },
    // {
    //   type: 'list',
    //   name: 'color',
    //   message: 'What is your favorite color?',
    //   default: 'blue',
    //   choices: [
    //     {
    //       name: 'Red',
    //       value: 'red'
    //     },
    //     {
    //       name: 'Blue',
    //       value: 'blue'
    //     },
    //     {
    //       name: 'Green',
    //       value: 'green'
    //     },
    //     {
    //       name: 'Yellow',
    //       value: 'yellow'
    //     },
    //     {
    //       name: 'Black',
    //       value: 'black'
    //     },
    //     {
    //       name: 'White',
    //       value: 'white'
    //     }
    //   ]
    // },
    {
      type: 'expand',
      name: 'color',
      message: 'What is your favorite color?',
      default: 'blue',
      choices: [
        {
          key: 'r',
          name: 'Red',
          value: 'red'
        },
        {
          key: 'b',
          name: 'Blue',
          value: 'blue'
        },
        {
          key: 'g',
          name: 'Green',
          value: 'green'
        },
        {
          key: 'y',
          name: 'Yellow',
        }
      ]
    },
    {
      type: 'input',
      name: 'name',
      message: 'What is your name?',
      default: 'Jay',
      validate: function (input) {
        // If the input is not a string, return 'Please enter a valid name'
        // Otherwise return true
        return input === 'Jay' || 'Please enter a valid name'
      },
      transformer: function (input) {
        return input.toUpperCase()
      },
      filter: function (input) {
        return input.toLowerCase()
      }
    },
    {
      type: 'input',
      name: 'email',
      message: 'What is your email?',
      default: 'jay@jay.com'
    },
    {
      type: 'number',
      name: 'phone',
      message: 'What is your phone?',
      default: '13800138000'
      // validate: function (input) {
      //   // If the input is not a number, return 'Please enter a valid phone'
      //   // Otherwise return true
      //   return (typeof input === 'number' && input.length === 11) || 'Please enter a valid phone number'
      // }
    },
    {
      type: 'password',
      name: 'password',
      message: 'What is your password?',
      default: '123456',
      mask: '*'
    }
  ])
  .then((answers) => {
    // Use user feedback for... whatever!!
    console.log(answers)
  })
  .catch((error) => {
    if (error.isTtyError) {
      // Prompt couldn't be rendered in the current environment
    } else {
      // Something else went wrong
    }
  })
