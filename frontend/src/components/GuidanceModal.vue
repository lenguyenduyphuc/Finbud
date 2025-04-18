<template>
  <div class="sidebar-overlay" :class="{ 'show': showModal }" @click.self="close">
    <div class="sidebar-content">
      <button class="close-btn" @click="close">x</button>
      <div class="guidance-text">
        <p>Welcome to <span class="brand-name">FinBud</span>! Here are some <span class="command">commands</span> to
          help you get started:</p>
        <ol class="guidance-list">
          <!-- guidance for general users -->
          <li v-for="(item, index) in generalGuidanceList" :key="index" @click="toggleExpansion(item)"
            :class="{ 'expanded': expandedItem === item }">
            <span class="header-list">{{ item.header }}</span>
            <div v-if="item.command" class="command-container">
              <span class="command">{{ item.command }}</span>
            </div>
            <div v-if="item.instruction">{{ item.instruction }}.</div>
            <div v-if="item.example">(e.g. "{{ item.example }}").</div>
            <div v-if="item.additionalInfo">{{ item.additionalInfo }}.</div>
            <div class="expanded-content">
              <img class="explanation" :src="item.explanation" alt="explanation" @click="handleImageClick(item)">
            </div>
          </li>
          <!-- guidance for authenticated users -->
          <div v-if="this.isAuthenticated">
            <li v-for="(item, index) in userGuidanceList" :key="index" @click="toggleExpansion(item)"
              :class="{ 'expanded': expandedItem === item }">
              <span class="header-list">{{ item.header }}</span>
              <div v-if="item.command" class="command-container">
                <span class="command">{{ item.command }}</span>
              </div>
              <div v-if="item.instruction">{{ item.instruction }}.</div>
              <div v-if="item.example">(e.g. "{{ item.example }}").</div>
              <div class="expanded-content">
                <img class="explanation" :src="item.explanation" alt="explanation" @click.stop="handleImageClick(item)">
              </div>
            </li>
          </div>
          <!-- this one always at last regardless of user status -->
          <!-- <li @click="toggleExpansion(generalAdvice)"
            :class="{ 'expanded': expandedItem === generalAdvice }"
          >
            <span class="header-list">{{generalAdvice.header}}</span>
            <br> {{generalAdvice.instruction}}
            <div class="expanded-content">
              <img class="explanation" :src="generalAdvice.explanation" alt="explanation">
            </div>
          </li> -->
        </ol>
      </div>
    </div>
  </div>
</template>

<script>
import search from '@/assets/guidance-explanation/search.png'
import stockPrice from '@/assets/guidance-explanation/stock-price.png'
import define from '@/assets/guidance-explanation/define.png'
import crypto from '@/assets/guidance-explanation/crypto.png'
import realestate from '@/assets/guidance-explanation/realestate.png'
import add from '@/assets/guidance-explanation/add.png'
import spend from '@/assets/guidance-explanation/spend.png'
import buy from '@/assets/guidance-explanation/buy.png'
import sell from '@/assets/guidance-explanation/sell.png'
// import general from '@/assets/guidance-explanation/general.png'
import create from '@/assets/guidance-explanation/create.png'
export default {
  name: 'GuidanceModal',
  props: {
    showModal: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      generalGuidanceList: [
        {
          header: "Advanced search",
          command: "#search [term]",
          instruction: "Enter search term",
          example: "#search stock market",
          explanation: search,
        },
        {
          header: "Stock Price Inquiry",
          command: null,
          instruction: "Enter the stock code in uppercase",
          example: "TSLA",
          explanation: stockPrice,
        },
        {
          header: "Financial Term Definitions",
          command: "#define [term]",
          instruction: null,
          example: "#define IPO",
          explanation: define,
        },
        {
          header: "List of Top 5 Cryptocurrencies",
          command: "#crypto",
          instruction: null,
          example: null,
          explanation: crypto,
        },
        {
          header: "Show 5 Properties in area",
          command: "#realestate [area_name]",
          example: "#realestate new york",
          additionalInfo: "If no area is specified, the default location will be San Jose.",
          explanation: realestate,
        },
      ],
      userGuidanceList: [
        {
          header: "Add a Transaction",
          command: "#add [description] [amount]",
          example: "#add Shopping 125",
          explanation: add,
        },
        {
          header: "Track Spending",
          command: "#spend [description] [amount]",
          example: "#spend Shopping 125",
          explanation: spend,
        },
        {
          header: "Buy Stock",
          command: "#buy [stock_name] [quantity]",
          example: "#buy TSLA 10",
          explanation: buy,
        },
        {
          header: "Sell Stock",
          command: "#sell [stock_name] [quantity]",
          example: "#sell TSLA 10",
          explanation: sell,
        },
        {
          header: "Add a Goal",
          command: "#create goal",
          example: null,
          explanation: create,
        },
      ],
      // generalAdvice: {
      //   header: "General Financial Concepts & Advice",
      //   instruction: "For general inquiries, use descriptive terms.",
      //   explanation: general,
      // },
      expandedItem: null,
    };
  },
  computed: {
    isAuthenticated() {
      return this.$store.getters["users/isAuthenticated"];
    }
  },
  methods: {
    close() {
      this.$emit('close');
    },
    toggleExpansion(item) {
      //if it is already expanded and click into it again:
      if (this.expandedItem === item) {
        this.expandedItem = null;
      }
      else {
        this.expandedItem = item;
      }
    },
    handleImageClick(item) {
      this.$emit("sendMessage", item.example || item.command);
      this.close();
    }
  }
};
</script>
<style scoped>
/* ___________________________*/
/* guidance appreance */
.sidebar-overlay {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: flex-end;
  z-index: 1000;
  visibility: hidden;
  opacity: 0;
  transition: visibility 0s 0.3s, opacity 0.3s ease-in-out;
}

.sidebar-overlay.show {
  visibility: visible;
  opacity: 1;
  transition: opacity 0.3s ease-in-out;
}

.sidebar-content {
  background: white;
  padding: 20px;
  border-radius: 40px 0 0 40px;
  max-width: 500px;
  width: 25%;
  height: 80%;
  margin-top: 7%;
  border: 3px solid #007bff;
  overflow: auto;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transform: translateX(100%);
  transition: transform 0.3s ease-in-out;
}

.sidebar-overlay.show .sidebar-content {
  transform: translateX(0);
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
}

/* ___________________________*/
/* text inside the guidance */

.guidance-text {
  background-color: white;
  margin-bottom: 30px;
}

.guidance-list {
  margin-left: -40px;
}

.guidance-text ol li {
  padding: 10px;
  border: 2px solid black;
  border-radius: 15px;
  margin: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.guidance-text p {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 10px;
}

.brand-name {
  font-weight: bolder;
  color: #007bff;
}

.guidance-text ol {
  list-style-type: none;
  counter-reset: guidance-number;
}


.guidance-text ol li::before {
  content: counter(guidance-number) ". ";
  counter-increment: guidance-number;
  font-weight: bold;
}

.guidance-text ol li:hover {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  /*transform: scale(1.05);*/
  border: 2px solid #007bff;
}

.command {
  background-color: rgb(0, 123, 255, 0.7);
  padding: 2px 5px;
  border-radius: 5px;
  line-height: normal;
  color: white;
  text-align: center;
}

.header-list {
  font-weight: bold;
}

.command-container {
  text-align: center;
  margin: 10px 0;
}

/* ___________________________*/
/* Command expansion */

.expanded-content {
  transition: all 0.3s ease-in-out;
  /* opacity, max-height*/
  border-radius: 4px;
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  border-right: 2px solid #007bff;
  display: flex;
  justify-content: end;
}

.expanded .expanded-content {
  max-height: 1000px;
  padding: 10px;
  margin-top: 20px;
  opacity: 1;
  display: flex;
  justify-content: end;
}

.explanation {
  height: 50px;
}

/* ___________________________*/
/* Media queries */
@media (max-width: 768px) {
  .sidebar-content {
    width: 80%;
    position: absolute;
    bottom: 6%;
  }
}
</style>
