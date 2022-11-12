import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import CarouselFade from './carousel';


export default function Dashboard() {
    return (
        <div className="App nftapp">
      <div className='p-3' style={{marginTop: "5px"}}>
                  <CarouselFade />
      </div>
          <div className="row px-4 pt-2">
            <div class="header">
              <h2 className="titlefont p-3" style={{marginTop: "5px"}}>KAROOTI NFT Staking Pool Active Rewards</h2>
              <table className="table px-3 table-bordered table-dark">
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Collection</th>
                    <th scope="col">Rewards Per Day</th>
                    <th scope="col">Exchangeable Items</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>WHY Common Collection</td>
                    <td class="amount" data-test-id="rewards-summary-ads">
                      <span class="amount">0.50</span>&nbsp;
                      <span class="currency">N2DR</span>
                    </td>
                    <td class="exchange">
                      <span class="amount">2</span>&nbsp;
                      <span class="currency">NFTs/M</span>
                    </td>
                  </tr>
                  <tr>
                    <td>WHY Uncommon Collection</td>
                    <td class="amount" data-test-id="rewards-summary-ac">
                      <span class="amount">2.50</span>&nbsp;
                      <span class="currency">N2DR</span>
                    </td>
                    <td class="exchange">
                      <span class="amount">10</span>&nbsp;
                      <span class="currency">NFTs/M</span>
                    </td>
                  </tr>
                  <tr className="stakeeffect">
                    <td>WHY Trip Collection</td>
                    <td class="amount" data-test-id="rewards-summary-ac">
                      <span class="amount">2.50</span>&nbsp;
                      <span class="currency">N2DR</span>
                    </td>
                    <td class="exchange">
                      <span class="amount">10</span>&nbsp;
                      <span class="currency">NFTs/M</span>
                    </td>
                  </tr>
                  <tr className="stakegoldeffect">
                    <td>WHY Legendary Collection</td>
                    <td class="amount" data-test-id="rewards-summary-one-time">
                      <span class="amount">1</span>&nbsp;
                      <span class="currency">N2DR+</span>
                    </td>
                    <td class="exchange">
                      <span class="amount">25 NFTs/M or </span>
                      <span class="currency">100 N2DR/M</span>
                    </td>
                  </tr>
                </tbody>
              </table>
  
              <div class="header">
              <h2 className="titlefont p-3" style={{marginTop: "5px"}}>KAROOTI Token Stake Farms</h2>
                <table
                  className="table table-bordered table-dark"
                  style={{ borderRadius: "14px" }}
                >
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Farm Pools</th>
                      <th scope="col">Harvest Daily Earnings</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Stake N2DR to Earn N2DR</td>
                      <td class="amount" data-test-id="rewards-summary-ads">
                        <span class="amount">0.01</span>&nbsp;
                        <span class="currency">Per N2DR</span>
                      </td>
                    </tr>
                    <tr>
                      <td>Stake N2DR to Earn N2DR+</td>
                      <td class="amount" data-test-id="rewards-summary-ac">
                        <span class="amount">0.005</span>&nbsp;
                        <span class="currency">Per N2DR</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          </div>
    );
  }
  