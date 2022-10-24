import { WalletConnection } from 'near-api-js';
import 'regenerator-runtime/runtime';
import { Wallet } from './near-wallet';
import { utils }  from 'near-api-js';
import { Account } from 'near-api-js';
import * as nearAPI from "near-api-js";

// When creating the wallet you can optionally ask to create an access key
// Having the key enables to call non-payable methods without interrupting the user to sign
const CONTRACT_ADDRESS = process.env.CONTRACT_NAME
const wallet = new Wallet({ createAccessKeyFor: CONTRACT_ADDRESS })



// Setup on page load
window.onload = async () => {
  let isSignedIn = await wallet.startUp();

  if (isSignedIn) {
    signedInFlow();
  } else {
    signedOutFlow();
  }
};

// Button clicks
$ = (e) => document.querySelector(e)
$('#sign-in-button').onclick = () => { wallet.signIn(); };
$('#sign-out-button').onclick = () => { wallet.signOut(); };


// Display the signed-out-flow container
function signedOutFlow() {
  document.querySelectorAll('#signed-in-flow').forEach(el => {
    el.style.display = 'none';
  });

  document.querySelectorAll('#signed-out-flow').forEach(el => {
    el.style.display = 'block';
  });

}

// Displaying the signed in flow container and fill in account-specific data
async function signedInFlow() {
  document.getElementById("account-b").innerHTML = wallet.getAccountBalance();
  document.querySelectorAll('#signed-in-flow').forEach(el => {
    el.style.display = 'block';
  });
  document.querySelectorAll('#signed-out-flow').forEach(el => {
    el.style.display = 'none';
  });
  document.querySelectorAll('[data-behavior=account-id]').forEach(el => {
    el.innerText = wallet.accountId;
  });
  
}
function formatAmount(amount) {
  let formatted = amount.toLocaleString('fullwide', { useGrouping: false })
  formatted = utils.format.formatNearAmount(formatted)
  return Math.floor(formatted * 100) / 100
}