const git = require('isomorphic-git');
const fs = require('fs');
const http = require('isomorphic-git/http/node');

async function doPush() {
  const dir = process.cwd();
  try {
    console.log('Adding files...');
    await git.add({ fs, dir, filepath: '.' });
    
    console.log('Committing...');
    await git.commit({
      fs,
      dir,
      author: {
        name: 'Antigravity AI',
        email: 'ai@antigravity.dev',
      },
      message: 'feat: Ultimate Demo Upgrade - Sentinel Engine, Lab Workflow, UI Polish'
    });
    
    console.log('Pushing to GitHub...');
    const pushResult = await git.push({
      fs,
      http,
      dir,
      remote: 'origin',
      ref: 'main'
    });
    console.log('Push completed successfully!', pushResult);
  } catch (err) {
    console.error('Git Error:', err);
  }
}

doPush();
