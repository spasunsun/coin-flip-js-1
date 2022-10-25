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
$('#choose-heads').onclick = () => { player_choose('heads'); };
$('#choose-tails').onclick = () => { player_choose('tails'); };
async function player_choose(side) {
  reset_buttons()
  start_flip_animation()
  set_status("Asking the contract to flip a coin")

  // Call the smart contract asking to flip a coin
  let outcome = await wallet.callMethod({ contractId: CONTRACT_ADDRESS, method: 'flip_coin', args: { player_guess: side } });

  // UI
  set_status(`The outcome was ${outcome}`)
  stop_flip_animation_in(outcome)

  if(outcome == side){
    set_status("You were right, you win a point!")
    $(`#choose-${side}`).style.backgroundColor = "green"
  }else{
    set_status("You were wrong, you lost a point")
    $(`#choose-${side}`).style.backgroundColor = "red"
  }

  // Fetch the new score
  fetchScore();
}

// Display the signed-out-flow container
function signedOutFlow() {
  document.querySelectorAll('#signed-in-flow').forEach(el => {
    el.style.display = 'none';
  });

  document.querySelectorAll('#signed-out-flow').forEach(el => {
    el.style.display = 'block';
  });
  $('#coin').style.animation = "flip 3.5s ease 0.5s";

}
async function fetchScore(){
  console.log(wallet.accountId)
  const score = await wallet.viewMethod({ contractId: CONTRACT_ADDRESS, method: 'points_of', args: {player: wallet.accountId} });

  document.querySelectorAll('[data-behavior=points]').forEach(el => {
    el.innerText = score;
  });
}
// Displaying the signed in flow container and fill in account-specific data
async function signedInFlow() {
  document.querySelectorAll('#signed-in-flow').forEach(el => {
    el.style.display = 'block';
  });
  document.querySelectorAll('#signed-out-flow').forEach(el => {
    el.style.display = 'none';
  });
  document.querySelectorAll('[data-behavior=account-id]').forEach(el => {
    el.innerText = wallet.accountId;
  });
  let x = document.getElementById("x").value 
  await contract.method_name(
    {
      arg_name: "value", // argument name and value - pass empty object if no args required
    },
    "300000000000000", // attached GAS (optional)
    "x*10^24" // attached deposit in yoctoNEAR (optional)
  ); 
  
}
function formatAmount(amount) {
  let formatted = amount.toLocaleString('fullwide', { useGrouping: false })
  formatted = utils.format.formatNearAmount(formatted)
  return Math.floor(formatted * 100) / 100
}