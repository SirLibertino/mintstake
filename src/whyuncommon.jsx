import './App.css';
import { Button, ButtonGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from 'react';
import axios from 'axios';
import ABI2 from './ABI.json';
import VAULTABI2 from './VAULTABI.json';
import TOKENABI from './TOKENABI.json';
import { NFTCONTRACT2, STAKINGCONTRACT2, polygonscanapi, moralisapi, Web3Alc } from './config';
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import WalletLink from "walletlink";
import Web3 from 'web3';
import NFT2 from './nft2';

var account = null;
var contract = null;
var vaultcontract = null;
var web3 = null;

const moralisapikey = process.env.REACT_APP_MORALIS;
const polygonscanapikey = process.env.REACT_APP_POLYGONSCAN;

const providerOptions = {
	binancechainwallet: {
		package: true
	  },
	  walletconnect: {
		package: WalletConnectProvider,
		options: {
		  infuraId: process.env.REACT_APP_INFURA,
		}
	},
	walletlink: {
		package: WalletLink, 
		options: {
		  appName: "KAROOTI NFT Minter", 
		  infuraId: process.env.REACT_APP_INFURA,
		  rpc: "", 
		  chainId: 80001,
		  appLogoUrl: null, 
		  darkMode: true 
		}
	  },
};

const web3Modal = new Web3Modal({
	network: "mumbai",
	theme: "dark",
	cacheProvider: true,
	providerOptions 
  });

class WHYUncommon extends Component {
	constructor() {
		super();
		this.state = {
			balance: [],
			rawearn: [],
		};
	}
  
	handleModal(){  
		this.setState({show:!this.state.show})  
	} 

	handleNFT(nftamount) {
		this.setState({outvalue:nftamount.target.value});
  	}

	async componentDidMount() {
		
		await axios.get((polygonscanapi + `?module=stats&action=tokensupply&contractaddress=${NFTCONTRACT2}&apikey=${polygonscanapikey}`))
		.then(outputa => {
            this.setState({
                balance:outputa.data
            })
            console.log(outputa.data)
        })
		let config = {'X-API-Key': moralisapikey, 'accept': 'application/json'};
		await axios.get((moralisapi + `/nft/${NFTCONTRACT2}/owners?chain=mumbai&format=decimal`), {headers: config})
		.then(outputb => {
			const { result } = outputb.data
            this.setState({
                nftdata:result
            })
            console.log(outputb.data)
        })
	}


render() {
	const {balance} = this.state;
	const {outvalue} = this.state;
  

  const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }

  const expectedBlockTime = 10000;

  async function connectwallet() {
    var provider = await web3Modal.connect();
    web3 = new Web3(provider);
    await provider.send('eth_requestAccounts');
    var accounts = await web3.eth.getAccounts();
    account = accounts[0];
    document.getElementById('wallet-address').textContent = account;
    contract = new web3.eth.Contract(ABI2, NFTCONTRACT2);
    vaultcontract = new web3.eth.Contract(VAULTABI2, STAKINGCONTRACT2);
    var getstakednfts = await vaultcontract.methods.tokensOfOwner(account).call();
    document.getElementById('yournfts').textContent = getstakednfts;
    var getbalance = Number(await vaultcontract.methods.balanceOf(account).call());
    document.getElementById('stakedbalance').textContent = getbalance;
    const arraynft = Array.from(getstakednfts.map(Number));
		const tokenid = arraynft.filter(Number);
		var rwdArray = [];
    tokenid.forEach(async (id) => {
      var rawearn = await vaultcontract.methods.earningInfo(account, [id]).call();
      var array = Array.from(rawearn.map(Number));
      console.log(array);
      array.forEach(async (item) => {
        var earned = String(item).split(",")[0];
        var earnedrwd = Web3.utils.fromWei(earned);
        var rewardx = Number(earnedrwd).toFixed(2);
        var numrwd = Number(rewardx);
        console.log(numrwd);
        rwdArray.push(numrwd);
      });
    });
    function delay() {
      return new Promise(resolve => setTimeout(resolve, 300));
    }
    async function delayedLog(item) {
      await delay();
      var sum = item.reduce((a, b) => a + b, 0);
      var formatsum = Number(sum).toFixed(2);
      document.getElementById('earned').textContent = formatsum;
    }
    async function processArray(rwdArray) {
      for (const item of rwdArray) {
        await delayedLog(item);
      }
    }
    return processArray([rwdArray]);
  }

  async function verify() {
    var getstakednfts = await vaultcontract.methods.tokensOfOwner(account).call();
    document.getElementById('yournfts').textContent = getstakednfts;
    var getbalance = Number(await vaultcontract.methods.balanceOf(account).call());
    document.getElementById('stakedbalance').textContent = getbalance;
  }

  async function enable() {
    contract.methods.setApprovalForAll(STAKINGCONTRACT2, true).send({ from: account });
  }
  async function rewardinfo() {
    var rawnfts = await vaultcontract.methods.tokensOfOwner(account).call();
    const arraynft = Array.from(rawnfts.map(Number));
    const tokenid = arraynft.filter(Number);
    var rwdArray = [];
    tokenid.forEach(async (id) => {
      var rawearn = await vaultcontract.methods.earningInfo(account, [id]).call();
      var array = Array.from(rawearn.map(Number));
      array.forEach(async (item) => {
        var earned = String(item).split(",")[0];
        var earnedrwd = Web3.utils.fromWei(earned);
        var rewardx = Number(earnedrwd).toFixed(2);
        var numrwd = Number(rewardx);
        rwdArray.push(numrwd)
      });
    });
    function delay() {
      return new Promise(resolve => setTimeout(resolve, 300));
    }
    async function delayedLog(item) {
      await delay();
      var sum = item.reduce((a, b) => a + b, 0);
      var formatsum = Number(sum).toFixed(2);
      document.getElementById('earned').textContent = formatsum;
    }
    async function processArray(rwdArray) {
      for (const item of rwdArray) {
        await delayedLog(item);
      }
    }
    return processArray([rwdArray]);
  }
  async function claimit() {
    var rawnfts = await vaultcontract.methods.tokensOfOwner(account).call();
    const arraynft = Array.from(rawnfts.map(Number));
    const tokenid = arraynft.filter(Number);
    await Web3Alc.eth.getMaxPriorityFeePerGas().then((tip) => {
      Web3Alc.eth.getBlock('pending').then((block) => {
        var baseFee = Number(block.baseFeePerGas);
        var maxPriority = Number(tip);
        var maxFee = maxPriority + baseFee;
        tokenid.forEach(async (id) => {
          await vaultcontract.methods.claim([id])
            .send({
              from: account,
              maxFeePerGas: maxFee,
              maxPriorityFeePerGas: maxPriority
            })
        })
      });
    })
  }
  async function unstakeall() {
    var rawnfts = await vaultcontract.methods.tokensOfOwner(account).call();
    const arraynft = Array.from(rawnfts.map(Number));
    const tokenid = arraynft.filter(Number);
    await Web3Alc.eth.getMaxPriorityFeePerGas().then((tip) => {
      Web3Alc.eth.getBlock('pending').then((block) => {
        var baseFee = Number(block.baseFeePerGas);
        var maxPriority = Number(tip);
        var maxFee = maxPriority + baseFee;
        tokenid.forEach(async (id) => {
          await vaultcontract.methods.unstake([id])
            .send({
              from: account,
              maxFeePerGas: maxFee,
              maxPriorityFeePerGas: maxPriority
            })
        })
      });
    })
  }
  async function mintnative() {
    var _mintAmount = Number(outvalue);
    var mintRate = Number(await contract.methods.cost().call());
    var totalAmount = mintRate * _mintAmount;
    await Web3Alc.eth.getMaxPriorityFeePerGas().then((tip) => {
        Web3Alc.eth.getBlock('pending').then((block) => {
            var baseFee = Number(block.baseFeePerGas);
            var maxPriority = Number(tip);
            var maxFee = baseFee + maxPriority
        contract.methods.mint(account, _mintAmount)
            .send({ from: account,
              value: String(totalAmount),
              maxFeePerGas: maxFee,
              maxPriorityFeePerGas: maxPriority});
        });
    })
  }

  async function mint0() {
    var _pid = "0";
    var erc20address = await contract.methods.getCryptotoken(_pid).call();
    var currency = new web3.eth.Contract(TOKENABI, erc20address);
    var mintRate = await contract.methods.getNFTCost(_pid).call();
    var _mintAmount = Number(outvalue);
    var totalAmount = mintRate * _mintAmount;
    await Web3Alc.eth.getMaxPriorityFeePerGas().then((tip) => {
      Web3Alc.eth.getBlock('pending').then((block) => {
        var baseFee = Number(block.baseFeePerGas);
        var maxPriority = Number(tip);
        var maxFee = maxPriority + baseFee;
        currency.methods.approve(NFTCONTRACT2, String(totalAmount))
					  .send({
						  from: account})
              .then(currency.methods.transfer(NFTCONTRACT2, String(totalAmount))
						  .send({
							  from: account,
							  maxFeePerGas: maxFee,
							  maxPriorityFeePerGas: maxPriority
						  },
              async function (error, transactionHash) {
                console.log("Transfer Submitted, Hash: ", transactionHash)
                let transactionReceipt = null
                while (transactionReceipt == null) {
                  transactionReceipt = await web3.eth.getTransactionReceipt(transactionHash);
                  await sleep(expectedBlockTime)
                }
                window.console = {
                  log: function (str) {
                    var out = document.createElement("div");
                    out.appendChild(document.createTextNode(str));
                    document.getElementById("txout").appendChild(out);
                  }
                }
                console.log("Transfer Complete", transactionReceipt);
                contract.methods.mintpid(account, _mintAmount, _pid)
                .send({
                  from: account,
                  maxFeePerGas: maxFee,
                  maxPriorityFeePerGas: maxPriority
                });
            }));
    });
  });
}
const refreshPage = ()=>{
  window.location.reload();  
}

  return (
    <div className="App nftapp">
        <h2 className="titlefont p-3" style={{marginTop: "5px"}}>WHYteRabbitHole Uncommon Collection</h2>
        <div className='px-5 mb-4'>
            <input id="connectbtn" type="button" className="connectbutton mt-2 bg-gradient border-danger" onClick={connectwallet} value="Connect Your Wallet" />
          </div>
        <div className='container container-style'>
          <div className='col'>
            <body className='nftminter2'>
          <form>
            <div className="row pt-3">
              <div>
                <h2 className="pt-2" style={{ fontWeight: "30" }}>WHY Uncommon Minter</h2>
              </div>
              <h3>{balance.result}/3000</h3>
              <div className="pb-3" id='wallet-address' style={{
                color: "#39FF14",
                fontWeight: "400",
                fontSize: "15px",
                textShadow: "1px 1px 1px black",
              }}>
                <label for="floatingInput">Please Connect Wallet</label>
              </div>
            </div>
            <div className='mb-2'>
              <label style={{ fontWeight: "600", fontSize: "18px" }}>Select NFT Quantity</label>
            </div>
            <ButtonGroup size="lg"
              aria-label="First group"
              name="amount"
              style={{ border: "0.2px", borderRadius: "75px" }}
              onClick={nftamount => this.handleNFT(nftamount, "value")}
            >
              <Button className="btn bg-gradient border-warning" style={{ border: "0.2px", borderRadius: "75px", boxShadow: "1px 1px 5px #000000", backgroundColor: "#161616" }} value="1">1</Button>
              <Button className="btn bg-gradient border-warning" style={{ border: "0.2px", borderRadius: "75px", boxShadow: "1px 1px 5px #000000", backgroundColor: "#161616" }} value="2">2</Button>
              <Button className="btn bg-gradient border-warning" style={{ border: "0.2px", borderRadius: "75px", boxShadow: "1px 1px 5px #000000", backgroundColor: "#161616" }} value="5">5</Button>
              <Button className="btn bg-gradient border-warning" style={{ border: "0.2px", borderRadius: "75px", boxShadow: "1px 1px 5px #000000", backgroundColor: "#161616" }} value="10">10</Button>
              <Button className="btn bg-gradient border-warning" style={{ border: "0.2px", borderRadius: "75px", boxShadow: "1px 1px 5px #000000", backgroundColor: "#161616" }} value="25">25</Button>
            </ButtonGroup>
            <h6 className="pt-4" style={{ fontWeight: "600", fontSize: "18px" }}>Buy with your preferred crypto!</h6>
            <div className="row px-2 pb-2 row-style">
            <div className="col">
                <Button className="button-style btn bg-gradient border-warning" onClick={mintnative} style={{ border: "0.2px", borderRadius: "75px", boxShadow: "1px 1px 5px #000000", backgroundColor: "#161616" }}>
                  MATIC<img src="matic.png" width="50%" alt="matic" />
                </Button>
              </div>
              <div className="col ">
                <Button className="button-style btn bg-gradient border-warning" onClick={mint0} style={{ border: "0.2px", borderRadius: "75px", boxShadow: "1px 1px 5px #000000", backgroundColor: "#161616" }}>
                  KAROOTI<img src={"token.png"} width="44%" alt="token" />
                </Button>
              </div>
              <div>
                <label id='txout' style={{ color: "#39FF14", marginTop: "5px", fontSize: '20px', fontWeight: '500', textShadow: "1px 1px 2px #000000" }}>
                  <p style={{ fontSize: "20px" }}>Transfer Status</p>
                </label>
              </div>
            </div>
          </form>
          </body>
          </div>
        <div className='col'>
          <body className='nftstaker2 border-0'>
            <form>
              <h2 style={{ borderRadius: '14px', fontWeight: "300", fontSize: "25px" }}>WHY NFT Staking Vault </h2>
              <h6 style={{ fontWeight: "300" }}>First time staking?</h6>
              <Button className="btn bg-gradient border-danger" onClick={enable} style={{ backgroundColor: "#161616", boxShadow: "1px 1px 5px #000000" }} >Authorize Your Wallet</Button>
              <div className="row px-3">
                <div className="col">
                  <form class="stakingrewards" style={{ borderRadius: "25px", boxShadow: "1px 1px 15px #ffffff" }}>
                    <h5 style={{ color: "#FFFFFF", fontWeight: '300' }}>Your Vault Activity</h5>
                    <h6 style={{ color: "#FFFFFF" }}>Verify Staked Amount</h6>
                    <Button className="btn bg-gradient border-danger" onClick={verify} style={{ backgroundColor: "#ffffff10", boxShadow: "1px 1px 5px #000000" }} >Verify</Button>
                    <table className='table mt-3 mb-5 px-3 table-dark'>
                      <tr>
                        <td style={{ fontSize: "19px" }}>Your Staked NFTs:
                          <span style={{ backgroundColor: "#ffffff00", fontSize: "21px", color: "#39FF14", fontWeight: "500", textShadow: "1px 1px 2px #000000" }} id='yournfts'></span>
                        </td>
                      </tr>
                      <tr>
                        <td style={{ fontSize: "19px" }}>Total Staked NFTs:
                          <span style={{ backgroundColor: "#ffffff00", fontSize: "21px", color: "#39FF14", fontWeight: "500", textShadow: "1px 1px 2px #000000" }} id='stakedbalance'></span>
                        </td>
                      </tr>
                      <tr>
                        <td style={{ fontSize: "19px" }}>Unstake All Staked NFTs
                          <Button onClick={unstakeall} className="btn mb-3 bg-gradient border-danger" style={{ backgroundColor: "#ffffff10", boxShadow: "1px 1px 5px #000000" }}>Unstake All</Button>
                        </td>
                      </tr>
                    </table>
                  </form>
                  </div>
                  <img className="col-lg-4" src="token.png" alt="art" />
                  <div className="col">
                    <form className='stakingrewards' style={{ borderRadius: "25px", boxShadow: "1px 1px 15px #ffffff" }}>
                      <h5 style={{ color: "#FFFFFF", fontWeight: '300' }}> Staking Rewards</h5>
                      <Button className="btn bg-gradient border-danger" onClick={rewardinfo} style={{ backgroundColor: "#ffffff10", boxShadow: "1px 1px 5px #000000" }} >Earned KAROOTI Tokens</Button>
                      <div id='earned' style={{ color: "#39FF14", marginTop: "5px", fontSize: '25px', fontWeight: '500', textShadow: "1px 1px 2px #000000" }}><p style={{ fontSize: "20px" }}>Earned Tokens</p></div>
                      <div className='col-12 mt-2'>
                        <div style={{ color: 'white' }}>Claim Rewards</div>
                        <Button className="btn bg-gradient mb-2 border-danger" onClick={claimit} style={{ backgroundColor: "#ffffff10", boxShadow: "1px 1px 5px #000000" }}>Claim</Button>
                      </div>
                    </form>
                  </div>
                </div>
            </form>
          </body>
        </div>
      </div>
      <div className='row nftportal mt-3'>
        <div className='col mt-4 ml-3'>
        <img src="blocksec.png" width={'60%'} alt="polygon"></img>
      </div>
      <div className='col'>
        <h2 className='titlefont mt-3 mb-4'>Your NFT Portal</h2>
      <Button className="btn bg-gradient mb-2 border-danger" onClick={refreshPage} style={{ backgroundColor: "#000000", boxShadow: "1px 1px 5px #000000" }}>Refresh NFT Portal</Button>
      </div>
      <div className='col mt-3 mr-5'>
      <img src="web3.png" width={'60%'} alt="ethereum"></img>
      </div>
      <NFT2 />
      </div>
      </div>
    )
  }
}
export default WHYUncommon;

