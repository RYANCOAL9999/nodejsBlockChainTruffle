module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [

    // First application
    {
      name        : 'Smart Contract',
      script      : 'main.js',
	    instances   : 'max',
	    exec_mode   : 'cluster',
      error_file  : './logs/err.log',
      out_file    : './logs/out.log'
    },
  ]
};