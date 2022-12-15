import "./App.css";
import { Button } from "@nextui-org/react";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { Component } from "react";
import axios from "axios";
import ABI from "./ABI.json";
import VAULTABI from "./VAULTABI.json";
import TOKENABI from "./TOKENABI.json";
import {
  NFTCONTRACT,
  STAKINGCONTRACT,
  polygonscanapi,
  moralisapi,
  Web3Alc,
} from "./config";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import WalletLink from "walletlink";
import Web3 from "web3";
import NFT from "./nft";

var account = null;
var contract = null;
var vaultcontract = null;
var web3 = null;

const moralisapikey = process.env.REACT_APP_MORALIS;
const polygonscanapikey = process.env.REACT_APP_POLYGONSCAN;

const providerOptions = {
  binancechainwallet: {
    package: true,
  },
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: process.env.REACT_APP_INFURA,
    },
  },
  walletlink: {
    package: WalletLink,
    options: {
      appName: "KAROOTI NFT Minter",
      infuraId: process.env.REACT_APP_INFURA,
      rpc: "",
      chainId: 80001,
      appLogoUrl: null,
      darkMode: true,
    },
  },
};

const web3Modal = new Web3Modal({
  network: "mumbai",
  theme: "dark",
  cacheProvider: true,
  providerOptions,
});

class WHYCommon extends Component {
  constructor() {
    super();
    this.state = {
      balance: [],
      rawearn: [],
    };
  }

  handleModal() {
    this.setState({ show: !this.state.show });
  }

  handleNFT(nftamount) {
    this.setState({ outvalue: nftamount.target.value });
  }

  async componentDidMount() {
    await axios
      .get(
        polygonscanapi +
          `?module=stats&action=tokensupply&contractaddress=${NFTCONTRACT}&apikey=${polygonscanapikey}`
      )
      .then((outputa) => {
        this.setState({
          balance: outputa.data,
        });
        console.log(outputa.data);
      });
    let config = { "X-API-Key": moralisapikey, accept: "application/json" };
    await axios
      .get(
        moralisapi + `/nft/${NFTCONTRACT}/owners?chain=mumbai&format=decimal`,
        { headers: config }
      )
      .then((outputb) => {
        const { result } = outputb.data;
        this.setState({
          nftdata: result,
        });
        console.log(outputb.data);
      });
  }

  render() {
    const { balance } = this.state;
    const { outvalue } = this.state;

    const sleep = (milliseconds) => {
      return new Promise((resolve) => setTimeout(resolve, milliseconds));
    };

    const expectedBlockTime = 10000;

    async function connectwallet() {
      var provider = await web3Modal.connect();
      web3 = new Web3(provider);
      await provider.send("eth_requestAccounts");
      var accounts = await web3.eth.getAccounts();
      account = accounts[0];
      document.getElementById("wallet-address").textContent = account;
      contract = new web3.eth.Contract(ABI, NFTCONTRACT);
      vaultcontract = new web3.eth.Contract(VAULTABI, STAKINGCONTRACT);
      var getstakednfts = await vaultcontract.methods
        .tokensOfOwner(account)
        .call();
      document.getElementById("yournfts").textContent = getstakednfts;
      var getbalance = Number(
        await vaultcontract.methods.balanceOf(account).call()
      );
      document.getElementById("stakedbalance").textContent = getbalance;
      const arraynft = Array.from(getstakednfts.map(Number));
      const tokenid = arraynft.filter(Number);
      var rwdArray = [];
      tokenid.forEach(async (id) => {
        var rawearn = await vaultcontract.methods
          .earningInfo(account, [id])
          .call();
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
        return new Promise((resolve) => setTimeout(resolve, 300));
      }
      async function delayedLog(item) {
        await delay();
        var sum = item.reduce((a, b) => a + b, 0);
        var formatsum = Number(sum).toFixed(2);
        document.getElementById("earned").textContent = formatsum;
      }
      async function processArray(rwdArray) {
        for (const item of rwdArray) {
          await delayedLog(item);
        }
      }
      return processArray([rwdArray]);
    }

    async function verify() {
      var getstakednfts = await vaultcontract.methods
        .tokensOfOwner(account)
        .call();
      document.getElementById("yournfts").textContent = getstakednfts;
      var getbalance = Number(
        await vaultcontract.methods.balanceOf(account).call()
      );
      document.getElementById("stakedbalance").textContent = getbalance;
    }

    async function enable() {
      contract.methods
        .setApprovalForAll(STAKINGCONTRACT, true)
        .send({ from: account });
    }
    async function rewardinfo() {
      var rawnfts = await vaultcontract.methods.tokensOfOwner(account).call();
      const arraynft = Array.from(rawnfts.map(Number));
      const tokenid = arraynft.filter(Number);
      var rwdArray = [];
      tokenid.forEach(async (id) => {
        var rawearn = await vaultcontract.methods
          .earningInfo(account, [id])
          .call();
        var array = Array.from(rawearn.map(Number));
        array.forEach(async (item) => {
          var earned = String(item).split(",")[0];
          var earnedrwd = Web3.utils.fromWei(earned);
          var rewardx = Number(earnedrwd).toFixed(2);
          var numrwd = Number(rewardx);
          rwdArray.push(numrwd);
        });
      });
      function delay() {
        return new Promise((resolve) => setTimeout(resolve, 300));
      }
      async function delayedLog(item) {
        await delay();
        var sum = item.reduce((a, b) => a + b, 0);
        var formatsum = Number(sum).toFixed(2);
        document.getElementById("earned").textContent = formatsum;
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
        Web3Alc.eth.getBlock("pending").then((block) => {
          var baseFee = Number(block.baseFeePerGas);
          var maxPriority = Number(tip);
          var maxFee = maxPriority + baseFee;
          tokenid.forEach(async (id) => {
            await vaultcontract.methods.claim([id]).send({
              from: account,
              maxFeePerGas: maxFee,
              maxPriorityFeePerGas: maxPriority,
            });
          });
        });
      });
    }
    async function unstakeall() {
      var rawnfts = await vaultcontract.methods.tokensOfOwner(account).call();
      const arraynft = Array.from(rawnfts.map(Number));
      const tokenid = arraynft.filter(Number);
      await Web3Alc.eth.getMaxPriorityFeePerGas().then((tip) => {
        Web3Alc.eth.getBlock("pending").then((block) => {
          var baseFee = Number(block.baseFeePerGas);
          var maxPriority = Number(tip);
          var maxFee = maxPriority + baseFee;
          tokenid.forEach(async (id) => {
            await vaultcontract.methods.unstake([id]).send({
              from: account,
              maxFeePerGas: maxFee,
              maxPriorityFeePerGas: maxPriority,
            });
          });
        });
      });
    }
    async function mintnative() {
      var _mintAmount = Number(outvalue);
      var mintRate = Number(await contract.methods.cost().call());
      var totalAmount = mintRate * _mintAmount;
      await Web3Alc.eth.getMaxPriorityFeePerGas().then((tip) => {
        Web3Alc.eth.getBlock("pending").then((block) => {
          var baseFee = Number(block.baseFeePerGas);
          var maxPriority = Number(tip);
          var maxFee = baseFee + maxPriority;
          contract.methods
            .mint(account, _mintAmount)
            .send({
              from: account,
              value: String(totalAmount),
              maxFeePerGas: maxFee,
              maxPriorityFeePerGas: maxPriority,
            });
        });
      });
    }

    async function mint0() {
      var _pid = "0";
      var erc20address = await contract.methods.getCryptotoken(_pid).call();
      var currency = new web3.eth.Contract(TOKENABI, erc20address);
      var mintRate = await contract.methods.getNFTCost(_pid).call();
      var _mintAmount = Number(outvalue);
      var totalAmount = mintRate * _mintAmount;
      await Web3Alc.eth.getMaxPriorityFeePerGas().then((tip) => {
        Web3Alc.eth.getBlock("pending").then((block) => {
          var baseFee = Number(block.baseFeePerGas);
          var maxPriority = Number(tip);
          var maxFee = maxPriority + baseFee;
          currency.methods
            .approve(NFTCONTRACT, String(totalAmount))
            .send({
              from: account,
            })
            .then(
              currency.methods.transfer(NFTCONTRACT, String(totalAmount)).send(
                {
                  from: account,
                  maxFeePerGas: maxFee,
                  maxPriorityFeePerGas: maxPriority,
                },
                async function (error, transactionHash) {
                  console.log("Transfer Submitted, Hash: ", transactionHash);
                  let transactionReceipt = null;
                  while (transactionReceipt == null) {
                    transactionReceipt = await web3.eth.getTransactionReceipt(
                      transactionHash
                    );
                    await sleep(expectedBlockTime);
                  }
                  window.console = {
                    log: function (str) {
                      var out = document.createElement("div");
                      out.appendChild(document.createTextNode(str));
                      document.getElementById("txout").appendChild(out);
                    },
                  };
                  console.log("Transfer Complete", transactionReceipt);
                  contract.methods.mintpid(account, _mintAmount, _pid).send({
                    from: account,
                    maxFeePerGas: maxFee,
                    maxPriorityFeePerGas: maxPriority,
                  });
                }
              )
            );
        });
      });
    }
    const refreshPage = () => {
      window.location.reload();
    };

    return (
      <div className="App nftapp">
        <h2
          className="titlefont p-4"
          style={{ marginTop: "3px", color: "green" }}
        >
          WHYteRabbitHole Common Collection
        </h2>
        <h6 className="mb-3 gotham">
          <em>
            First MINT some NFTs from this Collection and simply STAKE them. The
            RABBITS work DAY and NIGHT for you!
          </em>
        </h6>
        <div className="px-5 mb-4">
          <Button
            className="center mb-4 gotham"
            color="gradient"
            shadow
            onPress={connectwallet}
          >
            Connect Wallet
          </Button>
        </div>
        <div className="container container-style">
          <div className="col">
            <body className="nftminter">
              <form>
                <div className="row pt-3">
                  <div>
                    <h2 className="pt-2" style={{ fontWeight: "30" }}>
                      WHY Common Minter
                    </h2>
                  </div>
                  <h3>{balance.result}/5000</h3>
                  <div
                    className="pb-3"
                    id="wallet-address"
                    style={{
                      color: "#39FF14",
                      fontWeight: "400",
                      fontSize: "15px",
                      textShadow: "1px 1px 1px black",
                    }}
                  >
                    <label for="floatingInput">Please Connect Wallet</label>
                  </div>
                </div>
                <div className="mb-2">
                  <label style={{ fontWeight: "600", fontSize: "18px" }}>
                    Select NFT Quantity
                  </label>
                </div>
                <Button.Group
                  size="lg"
                  aria-label="First group"
                  name="amount"
                  shadow
                  bordered
                  auto
                  rounded
                  style={{ border: "0.2px", borderRadius: "75px" }}
                  onPress={(nftamount) => this.handleNFT(nftamount, "value")}
                >
                  <Button
                    className="btn border-success text-white"
                    style={{
                      boxShadow: "1px 1px 5px #000000",
                      backgroundColor: "#161616",
                    }}
                    value="1"
                  >
                    1
                  </Button>
                  <Button
                    className="btn border-success text-white"
                    style={{
                      boxShadow: "1px 1px 5px #000000",
                      backgroundColor: "#161616",
                    }}
                    value="2"
                  >
                    2
                  </Button>
                  <Button
                    className="btn border-success text-white"
                    style={{
                      boxShadow: "1px 1px 5px #000000",
                      backgroundColor: "#161616",
                    }}
                    value="5"
                  >
                    5
                  </Button>
                  <Button
                    className="btn border-success text-white"
                    style={{
                      boxShadow: "1px 1px 5px #000000",
                      backgroundColor: "#161616",
                    }}
                    value="10"
                  >
                    10
                  </Button>
                  <Button
                    className="btn border-success text-white"
                    style={{
                      boxShadow: "1px 1px 5px #000000",
                      backgroundColor: "#161616",
                    }}
                    value="25"
                  >
                    25
                  </Button>
                </Button.Group>
                <h6
                  className="pt-4"
                  style={{ fontWeight: "600", fontSize: "18px" }}
                >
                  Buy with your preferred crypto!
                </h6>
                <h6
                  className="pt-4"
                  style={{ fontWeight: "400", fontSize: "15px", color: "gold" }}
                >
                  15 MATIC or 275 KARROTI
                </h6>
                <div className="row px-2 pb-2 row-style">
                  <div className="col">
                    <Button
                      shadow
                      bordered
                      auto
                      rounded
                      color="gradient"
                      className="font-bold bg-gradient text-white"
                      onPress={mintnative}
                      style={{
                        border: "0.2px",
                        borderRadius: "75px",
                        boxShadow: "1px 1px 5px #000000",
                        backgroundColor: "#161616",
                      }}
                    >
                      <strong>MATIC</strong>
                      <img src="matic.png" width="40%" alt="matic" />
                    </Button>
                  </div>
                  <div className="col ">
                    <Button
                      shadow
                      bordered
                      auto
                      rounded
                      color="gradient"
                      className="button-style font-bold bg-gradient text-white"
                      onPress={mint0}
                      style={{
                        border: "0.2px",
                        borderRadius: "75px",
                        boxShadow: "1px 1px 5px #000000",
                        backgroundColor: "#161616",
                      }}
                    >
                      <strong>KAROOTI</strong>
                      <img src={"token.png"} width="34%" alt="token" />
                    </Button>
                  </div>
                  <div>
                    <label
                      id="txout"
                      style={{
                        color: "#39FF14",
                        marginTop: "5px",
                        fontSize: "20px",
                        fontWeight: "500",
                        textShadow: "1px 1px 2px #000000",
                      }}
                    >
                      <p style={{ fontSize: "20px" }}>Transfer Status</p>
                    </label>
                  </div>
                </div>
              </form>
            </body>
          </div>
          <div className="col">
            <div>
              <body className="nftstaker border-0">
                <form>
                  <div className="flex-col justify-center">
                    <h2>WHY NFT Staking Vault</h2>
                    <h6>First time staking?</h6>
                    <Button
                      className="center"
                      color="success"
                      auto
                      ghost
                      onPress={enable}
                      style={{
                        backgroundColor: "#161616",
                        boxShadow: "1px 1px 5px #000000",
                      }}
                    >
                      Authorize Your Wallet
                    </Button>
                  </div>
                </form>
                <div>
                  <div className="row p-3">
                    <div className="col">
                      <form
                        class="stakingrewards"
                        style={{
                          borderRadius: "25px",
                          boxShadow: "1px 1px 15px #ffffff",
                        }}
                      >
                        <h5 style={{ color: "#FFFFFF", fontWeight: "600" }}>
                          Your Vault Activity
                        </h5>
                        <Button
                          className="center"
                          size="xs"
                          color="gradient"
                          shadow
                          onPress={verify}
                        >
                          Verify
                        </Button>
                        <table className="table mt-3 mb-5 px-3 table-dark">
                          <tr>
                            <td style={{ fontSize: "17px" }}>
                              Your Staked NFTs:
                              <span
                                style={{
                                  backgroundColor: "#ffffff00",
                                  fontSize: "21px",
                                  color: "#39FF14",
                                  fontWeight: "500",
                                  textShadow: "1px 1px 2px #000000",
                                }}
                                id="yournfts"
                              ></span>
                            </td>
                          </tr>
                          <tr>
                            <td style={{ fontSize: "17px" }}>
                              Total Staked NFTs:
                              <span
                                style={{
                                  backgroundColor: "#ffffff00",
                                  fontSize: "21px",
                                  color: "#39FF14",
                                  fontWeight: "500",
                                  textShadow: "1px 1px 2px #000000",
                                }}
                                id="stakedbalance"
                              ></span>
                            </td>
                          </tr>
                          <tr>
                            <td style={{ fontSize: "15px" }}>
                              Unstake All Staked NFTs
                              <Button
                                className="center mt-1 mb-3"
                                color="success"
                                auto
                                ghost
                                size="xs"
                                onPress={unstakeall}
                                style={{
                                  backgroundColor: "#ffffff10",
                                  boxShadow: "1px 1px 5px #000000",
                                }}
                              >
                                Unstake All
                              </Button>
                            </td>
                          </tr>
                        </table>
                      </form>
                    </div>
                    <img className="col-lg-4" src="token.png" alt="art" />
                    <div className="col">
                      <form
                        className="p-1 stakingrewards"
                        style={{
                          borderRadius: "25px",
                          boxShadow: "1px 1px 15px #ffffff",
                        }}
                      >
                        <h5 style={{ color: "#FFFFFF", fontWeight: "600" }}>
                          {" "}
                          Staking Rewards
                        </h5>
                        <Button
                          className="center"
                          size="xs"
                          color="gradient"
                          shadow
                          onPress={rewardinfo}
                        >
                          Refresh
                        </Button>
                        <div
                          id="earned"
                          style={{
                            color: "#39FF14",
                            marginTop: "15px",
                            marginBottom: "10px",
                            fontSize: "25px",
                            fontWeight: "500",
                            textShadow: "1px 1px 2px #000000",
                          }}
                        >
                          <p style={{ fontSize: "20px", marginTop: "20px" }}>
                            Earned Tokens
                          </p>
                        </div>
                        <div className="col mt-3 mb-3">
                          <div style={{ color: "white" }}>Claim Rewards</div>
                          <Button
                            onPress={claimit}
                            auto
                            ghost
                            color="success"
                            size="xs"
                            style={{
                              backgroundColor: "#ffffff10",
                              boxShadow: "1px 1px 5px #000000",
                            }}
                            className="center"
                          >
                            Claim
                          </Button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </body>
            </div>
          </div>
        </div>
        <div className="row nftportal mt-3">
          <div className="col mt-4 ml-3">
            <img src="blocksec.png" width={"50%"} alt="blocksecurity"></img>
          </div>
          <div className="col">
            <h2 className="titlefont mt-4 mb-1" style={{ color: "green" }}>
              Your NFT Portal
            </h2>
            <Button
              className="center gotham mt-2 mb-2"
              color="gradient"
              shadow
              onPress={refreshPage}
            >
              Refresh NFT Portal
            </Button>
            <h6 className="gotham mt-3">
              <em>Your owned and staked NFTs are displayed here.</em>
            </h6>
          </div>
          <div className="col mt-3 mr-5">
            <img src="web3.png" width={"50%"} alt="web3security"></img>
          </div>
          <NFT />
        </div>
      </div>
    );
  }
}
export default WHYCommon;
