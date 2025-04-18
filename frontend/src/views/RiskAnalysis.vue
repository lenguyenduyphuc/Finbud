<template>
  <div>
    <!-- Bot Chat Component - Placed outside the main container -->
    <div class="bot-chat-container" :class="{ 'bot-visible': activeTab === 'realEstate', 'bot-hidden': hidingBot }">
      <img class="bot-image" src="@/assets/botrmbg.png" alt="Bot" />
      <div class="bot-message" :class="{ 'message-visible': showMessage, 'message-hidden': hidingMessage }">
        <div v-if="isTyping" class="typing-animation">
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
        </div>
        <div v-else class="typed-message" v-html="typedContent"></div>
      </div>
    </div>
    
    <div class="container">
      <!-- Market Data Section -->
      <section class="content">
        <h2 class="headtitle">Market Data Center</h2>

        <!-- Sub Navigation Bar -->
        <div class="sub-nav">
          <button 
            v-for="tab in ['stock', 'crypto', 'realEstate']" 
            :key="tab"
            :class="['tab-button', { active: activeTab === tab }]"
            @click="activeTab = tab"
          >
            {{ formatTabName(tab) }}
          </button>
        </div>

        <div class="market-data-center">
          <!-- Crypto Tab Content -->
          <div v-if="activeTab === 'crypto'" class="tab-content">
            <div class="market-section">
              <!-- Cryptocurrency Watch Section -->
              <div class="section-title">Cryptocurrency Watch</div>
              <div class="margin-box">
                <CryptoWatch class="margin-box-content" />
              </div>
            
              
              <!-- Crypto Quotes Section -->
              <div class="section-title">Crypto Quotes</div>
              <div class="margin-box">
                <div class="margin-box-content">
                  <div v-if="errorCrypto" class="error">{{ errorCrypto }}</div> 
                  <div v-else-if="loadingCrypto" class="loading">Loading...</div>
                  <div v-else>
                    <table>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Rank</th>
                          <th>Tier</th>
                          <th>Price</th>
                          <th>Symbol</th>
                          <th>Change</th>
                        </tr>
                      </thead>
                      <tbody v-if="paginatedCryptoList.length">
                        <tr v-for="crypto in paginatedCryptoList" :key="crypto.uuid">
                          <td><img :src="crypto.iconUrl" :alt="crypto.name"> {{ crypto.name }}</td>
                          <td>{{ crypto.rank }}</td>
                          <td>{{ crypto.tier }}</td>
                          <td>{{ formatPrice(crypto.price) }} B</td>
                          <td>{{ crypto.symbol }}</td>
                          <td>{{ crypto.change }}</td>
                        </tr>
                      </tbody>
                    </table>
                    <Pagination :currentPage.sync="currentCryptoPage" :totalPages="cryptoTotalPages" @update:currentPage="updateCryptoCurrentPage" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Stock Tab Content -->
          <div v-if="activeTab === 'stock'" class="tab-content">
            <div class="market-section">
              <!-- Stock Watch Section -->
              <div class="section-title">Stock Watch</div>
              <div class="margin-box">
                <StockWatch class="margin-box-content" />
              </div>

              <!-- Stock Quotes Section -->
              <div class="section-title">Stock Quotes</div>
              <div class="margin-box">
                <div class="margin-box-content">
                  <div v-if="error" class="error">{{ error }}</div>
                  <div v-else-if="loading" class="loading">Loading...</div>
                  <div v-else>
                    <table>
                      <thead>
                        <tr>
                          <th>Symbol</th>
                          <th>Price</th>
                          <th>Volume</th>
                          <th>Previous Close</th>
                          <th>Change</th>
                          <th>Change Percent</th>
                        </tr>
                      </thead>
                      <tbody v-if="paginatedStockQuotes.length">
                        <tr v-for="stock in paginatedStockQuotes" :key="stock['01. symbol']">
                          <td>{{ stock['01. symbol'] }}</td>
                          <td>{{ stock['05. price'] }}</td>
                          <td>{{ stock['06. volume'] }}</td>
                          <td>{{ stock['08. previous close'] }}</td>
                          <td>{{ stock['09. change'] }}</td>
                          <td>{{ stock['10. change percent'] }}</td>
                        </tr>
                      </tbody>
                    </table>
                    <Pagination :currentPage.sync="currentStockPage" :totalPages="stockTotalPages" @update:currentPage="updateStockCurrentPage" />
                  </div>
                </div>
              </div>

              <!-- Stock History Section -->
              <div class="section-title">Stock History</div>
              <div class="margin-box">
                <div class="margin-box-content">
                  <!-- Add Stock History component here -->
                  <p>Stock History Component (Coming Soon)</p>
                </div>
              </div>

            </div>
          </div>

          <!-- Real Estate Tab Content -->
          <div v-if="activeTab === 'realEstate'" class="tab-content">
            <div class="market-section">
              <!-- Real Estate Section -->
              <div class="section-title">Real Estate</div>
              <div class="real-estate-section" ref="realEstateSection">
                <div class="margin-box">
                  <RealEstateMap class="margin-box-content" />
                  <div class="margin-box-content">
                    <div v-if="errorRealEstate" class="error">{{ errorRealEstate }}</div> 
                    <div v-else-if="loadingRealEstate" class="loading">Loading...</div>
                    <div v-else>
                      <table>
                        <thead>
                          <tr>
                            <th>Type</th>
                            <th>Address</th>
                            <th>Price</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody v-if="paginatedRealEstate.length">
                          <tr v-for="estate in paginatedRealEstate" :key="estate.id">
                            <td>{{ estate.propertyType && !isNaN(estate.propertyType) ? estate.propertyType : "Single-family"}}</td>
                            <td>{{ estate.formattedAddress }}</td>
                            <td>
                              {{ estate.lastSalePrice && !isNaN(estate.lastSalePrice) ? 
                              '$' + estate.lastSalePrice.toLocaleString() : "N/A" }}
                            </td>
                            <td>{{ estate.ownerOccupied === true ? 'Inactive' : 'Active'}}</td>
                          </tr>
                        </tbody>
                      </table>
                      <Pagination :currentPage.sync="currentRealEstatePage" :totalPages="realEstateTotalPages" @update:currentPage="updateRealEstateCurrentPage" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <!-- Risk Chat Section -->
      <RiskChat :activeTab="activeTab" />
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Pagination from '../components/Risk&Chat/Pagination.vue';
import RiskChat from '../components/Risk&Chat/RiskChat.vue';
import CryptoWatch from '@/components/marketPage/CryptoWatch.vue';
import StockWatch from '@/components/marketPage/StockWatch.vue';
import RealEstateMap from '@/components/marketPage/RealEstateMap.vue';

const apiKey = process.env.VUE_APP_ALPHA_VANTAGE_KEY; 
const apiKeyCrypto = process.env.VUE_APP_COINRANKING_KEY;
const apiKeyRealEstate = process.env.VUE_APP_REAL_ESTATE_KEY;

export default {
  name: 'RiskAnalysis',
  components: {
    Pagination,
    CryptoWatch,
    StockWatch,
    RealEstateMap,
    RiskChat,
  },
  data() {
    return {
      activeTab: 'stock',
      // Bot Chat data
      showBot: false,
      hidingBot: false,
      showMessage: false,
      hidingMessage: false,
      isTyping: false,
      botMessage: "",
      typedContent: "",
      botObserver: null,
      typingSpeed: 50, // milliseconds between characters
      typingIndex: 0,
      typingTimer: null,
      botHideTimer: null,
      words: [],
      currentWordIndex: 0,

      // Market Data
      loading: true,
      error: null,
      stockQuotes: [],
      loadingCrypto: true,
      errorCrypto: null,
      cryptoList: [],
      realEstateList: [
      {
						propertyType: "Single Family Home",
						formattedAddress: "123 Main St, San Jose, CA 95112",
						price: "$1,200,000",
						status: "For Sale"
					},
					{
						propertyType: "Condo",
						formattedAddress: "456 Elm St, San Jose, CA 95126",
						price: "$850,000",
						status: "Pending"
					},
					{
						propertyType: "Townhouse",
						formattedAddress: "789 Oak Ave, San Jose, CA 95128",
						price: "$975,000",
						status: "Sold"
					},
					{
						propertyType: "Apartment",
						formattedAddress: "101 Pine St, San Jose, CA 95110",
						price: "$3,200/mo",
						status: "For Rent"
					},
					{
						propertyType: "Duplex",
						formattedAddress: "202 Maple Dr, San Jose, CA 95125",
						price: "$1,050,000",
						status: "For Sale"
					}
      ],
      loadingRealEstate: true,
      errorRealEstate: null,
      currentRealEstatePage: 1,
      currentStockPage: 1,
      currentCryptoPage: 1,
      itemsPerPage: 10,
    };
  },
  computed: {
    stockTotalPages() {
      return Math.ceil(this.stockQuotes.length / this.itemsPerPage);
    },
    cryptoTotalPages() {
      return Math.ceil(this.cryptoList.length / this.itemsPerPage);
    },
    realEstateTotalPages(){
      return Math.ceil(this.realEstateList.length / this.itemsPerPage);
    },
    paginatedStockQuotes() {
      const start = (this.currentStockPage - 1) * this.itemsPerPage;
      return this.stockQuotes.slice(start, start + this.itemsPerPage);
    },
    paginatedCryptoList() {
      const start = (this.currentCryptoPage - 1) * this.itemsPerPage;
      return this.cryptoList.slice(start, start + this.itemsPerPage);
    },
    paginatedRealEstate() {
      const start = (this.currentRealEstatePage - 1) * this.itemsPerPage;
      return this.realEstateList.slice(start, start + this.itemsPerPage);
    },
  },
  watch: {
    activeTab: {
      immediate: true,
      handler(newTab) {
        if (newTab === 'realEstate') {
          this.startBotAnimation();
        } else {
          this.hideBot();
        }
      }
    }
  },
  mounted() {
    this.fetchStockQuote();
    this.getCryptoPrice();
    // this.getRealEstatePrice();
    this.setupBotObserver();
  },
  beforeUnmount() {
    // Clean up timers and observers when the component is destroyed
    if (this.botObserver) {
      this.botObserver.disconnect();
    }
    if (this.typingTimer) {
      clearTimeout(this.typingTimer);
    }
    if (this.botHideTimer) {
      clearTimeout(this.botHideTimer);
    }
  },
  methods: {
    // Set up the Intersection Observer to watch for scrolling
    setupBotObserver() {
      this.$nextTick(() => {
        // Make sure DOM is loaded and data is ready
        if (!this.$refs.realEstateSection) return;
        
        this.botObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting && !this.showBot && 
                !this.loading && !this.loadingCrypto && !this.loadingRealEstate) {
              this.startBotAnimation();
            }
          });
        }, { threshold: 0.2 }); // Trigger when 20% of real estate section is visible
        
        this.botObserver.observe(this.$refs.realEstateSection);
      });
    },

    // Bot Chat methods
    formatMarketSummary() {
      // Focus on real estate data since this bot appears in the real estate section
      let summary = "Hello! Looking for a new home?\n\n";

      if (this.realEstateList && this.realEstateList.length) {
        summary += "🏠 Here are some properties you might like:\n";
        this.realEstateList.slice(0, 3).forEach(estate => {
          summary += `${estate.propertyType || 'Home'} at ${estate.formattedAddress}\n`;
          if (estate.lastSalePrice && !isNaN(estate.lastSalePrice)) {
            summary += `Price: $${estate.lastSalePrice.toLocaleString()}\n`;
          }
          summary += `Status: ${estate.ownerOccupied === true ? 'Inactive' : 'Active'}\n\n`;
        });
      }
      
      summary += "Can I help you find your dream home?";
      return summary;
    },

    startBotAnimation() {
      // Reset any existing timers
      if (this.typingTimer) {
        clearTimeout(this.typingTimer);
      }
      if (this.botHideTimer) {
        clearTimeout(this.botHideTimer);
      }
      
      // Reset states
      this.hidingBot = false;
      this.hidingMessage = false;
      this.typedContent = "";
      
      // First show the bot avatar sliding in with enhanced smoothness
      this.showBot = true;
      
      // After bot slides in, show typing animation
      setTimeout(() => {
        this.showMessage = true;
        this.isTyping = true;
        
        // After typing animation, start word-by-word typing
        setTimeout(() => {
          this.isTyping = false;
          this.botMessage = this.formatMarketSummary();
          this.startWordByWordTyping();
        }, 1500);
      }, 800); // Wait for bot slide-in animation to complete
      
      // Disconnect the observer after triggering the animation
      if (this.botObserver) {
        this.botObserver.disconnect();
      }
    },
    
    startWordByWordTyping() {
      // Split the message by spaces and newlines to get words
      // This regex splits by spaces but keeps newlines as separate "words"
      this.words = this.botMessage.split(/( |\n)/g).filter(word => word !== "");
      this.currentWordIndex = 0;
      this.typedContent = "";
      this.typeNextWord();
    },
    
    typeNextWord() {
      if (this.currentWordIndex < this.words.length) {
        const word = this.words[this.currentWordIndex];
        
        // Add the word to the content
        if (word === "\n") {
          this.typedContent += "<br>";
        } else {
          this.typedContent += word;
        }
        
        this.currentWordIndex++;
        
        // Schedule the next word with a delay
        this.typingTimer = setTimeout(() => {
          this.typeNextWord();
        }, this.typingSpeed * (word.length / 2 + 1)); // Delay proportional to word length
      } else {
        // Typing complete, schedule the hide after 1 minute
        this.scheduleHideBot();
      }
    },
    
    scheduleHideBot() {
      // Set a timeout to hide the bot after 1 minute (60000ms)
      this.botHideTimer = setTimeout(() => {
        this.hideBot();
      }, 60000);
    },
    
    hideBot() {
      // Start fade-out animations
      this.hidingMessage = true;
      
      // Wait for message to fade out, then hide bot
      setTimeout(() => {
        this.hidingBot = true;
        
        // Reset states after animations complete
        setTimeout(() => {
          this.showBot = false;
          this.showMessage = false;
          this.hidingBot = false;
          this.hidingMessage = false;
          this.typedContent = "";
        }, 1000);
      }, 500);
    },

    // Existing market data methods
    async fetchStockQuote() {
      const symbols = ['IBM', 'AAPL', 'GOOGL', 'MSFT', 'AMZN', 'FB', 'TSLA', 'NFLX', 'NVDA', 'INTC', 'CSCO', 'ORCL', 'ADBE', 'CRM', 'PYPL', 'AMD', 'QCOM', 'TXN', 'AVGO', 'SHOP'];
      const apiKey = process.env.VUE_APP_ALPHA_VANTAGE_KEY;
      try {
        const requests = symbols.map(symbol => {
          const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;
          return axios.get(url);
        });
        const responses = await Promise.all(requests);
        this.stockQuotes = responses.map(response => {
          const quote = response.data['Global Quote'];
          if (quote && Object.keys(quote).length > 0) {
            return quote;
          } else {
            return null; 
          }
        }).filter(quote => quote !== null);
        this.loading = false;
      } catch (error) {
        this.error = 'Failed to fetch stock quotes';
        this.loading = false;
      }
    },
    async getCryptoPrice() {
      const url = "https://api.coinranking.com/v2/coins?timePeriod=7d";
      try {
        const res = await axios.get(url, {
          headers: {
            'x-access-token': apiKeyCrypto,
          }
        });
        this.cryptoList = res.data.data.coins;
        this.loadingCrypto = false;
      } catch (error) {
        this.errorCrypto = 'Failed to fetch crypto quotes';
        this.loadingCrypto = false;
      }
    },
    updateCryptoCurrentPage(newPage) {
      this.currentCryptoPage = newPage;
    },
    updateStockCurrentPage(newPage) {
      this.currentStockPage = newPage;
    },
    updateRealEstateCurrentPage(newPage){
      this.currentRealEstatePage = newPage;
    },
    formatPrice(price) {
      const x = parseFloat(price);
      if (x >= 1e9) {
        return (x / 1e9).toFixed(2);
      }
      return x.toFixed(2);
    },
    // async getRealEstatePrice(){
    //   const url = "https://api.rentcast.io/v1/properties/random";
    //   try {
    //     const response = await axios.get(url, {
    //       headers: {
    //         'X-Api-Key': apiKeyRealEstate
    //       }
    //     })
    //     this.realEstateList = response.data;
    //     this.loadingRealEstate = false;
    //   } catch (error){
    //     console.log('Error fetching real estate', error)
    //     this.errorRealEstate = 'Error fetching real estate';
    //     this.loadingRealEstate = false;
    //   }
    // },
    formatTabName(tab) {
      if (tab === 'realEstate') return 'Real Estate';
      return tab.charAt(0).toUpperCase() + tab.slice(1);
    },
  },
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.header {
  width: 100%;
  text-align: center;
  margin-bottom: 20px;
}

.headtitle {
  text-align: center;
  color: #333;
  font-size: 2rem;
  margin-bottom: 1rem;
}

.market-data-center {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem;
  background: white;
  margin: 2rem auto;
  max-width: 1200px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.section-title {
  font-weight: bold;
  color: #007bff;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  border-bottom: 2px solid #007bff;
  padding-bottom: 0.5rem;
  text-align: left;
}

.margin-box {
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
  background-color: #fff;
}

.margin-box-content {
  overflow-x: auto;
  white-space: nowrap;
}

.real-estate-section {
  position: relative;
  margin-bottom: 1rem;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  font-size: 0.9rem;
}

thead {
  background-color: #f8f8f8;
}

th, td {
  padding: 12px 15px;
  text-align: left;
  border: 1px solid #ddd;
}

th {
  background-color: #f2f2f2;
}

tr:nth-child(even) {
  background-color: #f9f9f9;
}

tr:hover {
  background-color: #f1f1f1;
}

.table-row {
  transition: background-color 0.3s ease;
}

img {
  max-width: 30px;
  height: auto;
  vertical-align: middle;
  margin-right: 8px;
}

.error {
  color: red;
  font-weight: bold;
  text-align: center;
  padding: 1rem;
}

.loading {
  color: gray;
  font-weight: bold;
  text-align: center;
  padding: 1rem;
}

/* Enhanced Bot Chat Styles */
.bot-chat-container {
  position: fixed; /* Fixed positioning relative to viewport */
  left: -350px; /* Start off-screen to the left */
  top: 30%;
  width: 300px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 15px;
  z-index: 100;
  transition: transform 1s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 1s ease;
  opacity: 0;
  transform: translateX(0);
  pointer-events: none; /* Prevents interaction with elements behind it */
}

.bot-chat-container.bot-visible {
  transform: translateX(350px); /* Move to the right */
  opacity: 1;
  pointer-events: auto; /* Re-enable interaction when visible */
}

.bot-chat-container.bot-hidden {
  transform: translateX(350px) translateY(50px);
  opacity: 0;
  transition: transform 1s ease, opacity 1s ease;
}

.bot-image {
  width: 80px;
  height: auto;
  display: block;
  position: relative;
  background: transparent;
  transition: transform 0.5s ease;
}

.bot-visible .bot-image {
  animation: botBounce 1s ease-out;
}

@keyframes botBounce {
  0% { transform: translateY(20px); opacity: 0; }
  60% { transform: translateY(-5px); }
  80% { transform: translateY(2px); }
  100% { transform: translateY(0); opacity: 1; }
}

.bot-message {
  margin-top: 10px;
  background: #2196F3;
  color: #ffffff;
  padding: 12px 18px;
  border-radius: 18px;
  max-width: 280px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  opacity: 0; /* Start hidden */
  transform: scale(0.8) translateY(10px); /* Start slightly smaller and lower */
  transition: opacity 0.7s ease, transform 0.7s ease;
  transition-delay: 0.3s; /* Reduced delay for smoother appearance */
}

.bot-message.message-visible {
  opacity: 1;
  transform: scale(1) translateY(0);
}

.bot-message.message-hidden {
  opacity: 0;
  transform: scale(0.8) translateY(10px);
  transition: opacity 0.5s ease, transform 0.5s ease;
}

/* Typing animation */
.typing-animation {
  display: flex;
  gap: 4px;
  padding: 4px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #ffffff;
  opacity: 0.3;
}

.dot:nth-child(1) {
  animation: typing 1s infinite 0s;
}

.dot:nth-child(2) {
  animation: typing 1s infinite 0.2s;
}

.dot:nth-child(3) {
  animation: typing 1s infinite 0.4s;
}

.typed-message {
  line-height: 1.5;
  word-wrap: break-word;
}

@keyframes typing {
  0%, 100% { 
    opacity: 0.3; 
    transform: scale(1);
  }
  50% { 
    opacity: 1;
    transform: scale(1.2);
  }
}

@media screen and (max-width: 1200px) {
  .market-data-center,
  .quotes-section {
    padding: 1.5rem;
    margin: 1.5rem auto;
  }

  .headtitle {
    font-size: 2rem;
  }

  .section-title {
    font-size: 1.5rem;
  }

  .margin-box {
    padding: 0.75rem;
  }
  
  /* Adjust bot position for smaller screens */
  .bot-chat-container {
    left: -300px;
  }
  
  .bot-chat-container.bot-visible {
    transform: translateX(310px);
  }
}

@media screen and (max-width: 992px) {
  .market-data-center,
  .quotes-section {
    padding: 1.5rem;
    margin: 1.5rem auto;
  }

  .headtitle {
    font-size: 1.75rem;
  }

  .section-title {
    font-size: 1.4rem;
  }

  .margin-box {
    padding: 0.75rem;
  }
}

@media screen and (max-width: 768px) {
  .market-data-center,
  .quotes-section {
    padding: 1rem;
    margin: 1rem auto;
  }

  .headtitle {
    font-size: 1.75rem;
  }

  .section-title {
    font-size: 1.3rem;
  }

  .margin-box {
    padding: 0.5rem;
  }
  
  /* For mobile, position the bot at the bottom of the screen */
  .bot-chat-container {
    left: auto;
    right: -300px;
    bottom: 20px;
    top: auto;
  }
  
  .bot-chat-container.bot-visible {
    transform: translateX(-310px);
  }
  
  .bot-chat-container.bot-hidden {
    transform: translateX(-310px) translateY(50px);
  }
}

@media screen and (max-width: 576px) {
  .market-data-center,
  .quotes-section {
    padding: 0.5rem;
    margin: 0.5rem auto;
  }

  .headtitle {
    font-size: 1.75rem;
  }

  .section-title {
    font-size: 1.2rem;
  }

  .margin-box {
    padding: 0.25rem;
  }
  
  /* Further adjustments for very small screens */
  .bot-chat-container {
    width: 250px;
  }
  
  .bot-message {
    max-width: 220px;
  }
}

/* Add these new styles for the sub-navigation */
.sub-nav {
  display: flex;
  justify-content: space-between;
  margin: 1rem auto 3rem;
  padding: 0.5rem;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  background: #f8f9fa;
  width: 600px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.tab-button {
  flex: 1;
  padding: 1rem 0;
  border: none;
  background: none;
  font-size: 1.3rem;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  font-weight: 500;
  margin: 0 0.25rem;
  border-radius: 8px;
}

.tab-button:hover {
  color: #007bff;
  background-color: rgba(0, 123, 255, 0.1);
}

.tab-button.active {
  color: white;
  background-color: #007bff;
  font-weight: bold;
}

/* Remove the underline effect */
.tab-button.active::after {
  display: none;
}

@media screen and (max-width: 768px) {
  .sub-nav {
    width: 90%;
    padding: 0.4rem;
  }

  .tab-button {
    padding: 0.75rem 0;
    font-size: 1.1rem;
  }
}

@media screen and (max-width: 576px) {
  .sub-nav {
    width: 95%;
    padding: 0.3rem;
  }

  .tab-button {
    padding: 0.5rem 0;
    font-size: 1rem;
    margin: 0 0.15rem;
  }
}

.tab-content {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>