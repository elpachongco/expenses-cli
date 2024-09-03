// const { createApp, ref } = Vue
Vue.createApp({
  data() {
    return {
      rows: [],
      rows_daily: {},
      rows_monthly: {},
      rows_categorical: {},
      processing: false,
      prevDate: null,
      first: true,
    }
  },
  methods: {
    handleCSVLineByLine: function (results) {
      let row = results.data
      if (this.first || row.length != 5 || !row[3]) {
        this.first = false
        return
      }

      let currentDate = row[0] || this.prevDate
      if (currentDate != this.prevDate) {
        this.prevDate = currentDate
      }
      row[0] = currentDate

      let price = Number(row[3].trim().replaceAll(',', ''))
      let currentMonth = currentDate == 'UPCOMING' ? currentDate : currentDate.slice(0,7);

      this.rows_daily[currentDate] =  (this.rows_daily[currentDate] || 0) + price;
      this.rows_monthly[currentMonth] = (this.rows_monthly[currentMonth] || 0) + price

      let category = row[4].trim() || 'UNKNOWN'
      this.rows_categorical[category] = (this.rows_categorical[category] || 0) + price
    },
    formatMoney: function (num) {
      return (new Intl.NumberFormat(undefined, {})).format(num)
    },
    formatMonth: function (dateStr) {
      return (new Date(dateStr)).toLocaleDateString(undefined, {month: 'short',year: 'numeric'}) || dateStr
    },
    formatDay: function (dateStr) {
      return (new Date(dateStr)).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'}) || dateStr
    },
  },
  mounted() {
    const _this = this
    let csvFile = document.getElementById('csv-file')

    csvFile.addEventListener('change', handleFile);

    async function handleFile() {
      const file = csvFile.files[0] 
      Papa.parse(file, {
        delimiter: ',',
        newline: '\n',
        step: _this.handleCSVLineByLine,
        before: () => _this.processing = true,
        complete: () => _this.processing = false,
        skipEmptyLines: true,
      })
    }

  },
  template: `
    <article>
        <label for="csv-file" style="display: inline-block; margin: auto 0;">
          <small>Upload expenses.csv file</small>
          <input id="csv-file" type="file" accept=".csv"></input>
        </label>
        <progress v-if="processing" />
    </article>

    <details open>
      <summary>Categorical</summary>
      <article>
        <table>
          <thead>
            <tr>
              <td>Category</td>
              <td>Total</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="[dateStr, row] in Object.entries(rows_categorical)">
              <td>{{ dateStr }}</td>
              <td>{{ formatMoney(row) }}</td>
            </tr>
          </tbody>
        </table>
      </article>
    </details>

    <div class="grid">
      
      <details open>
        <summary>Monthly</summary>
          <article>
            <table>
              <thead>
                <tr>
                  <td>Month</td>
                  <td>Total</td>
                </tr> 
              </thead>
              <template v-for="[dateStr, row] in Object.entries(rows_monthly)">
                <tbody>
                  <tr>
                    <td>{{ formatMonth(dateStr) }}</td>
                    <td>{{ formatMoney(row) }}</td>
                  </tr> 
                </tbody>
              </template>
            </table>
        </article>
      </details>

      <details open>
        <summary>Daily</summary>
          <article>
            <table>
              <thead>
                <tr>
                  <td>Day</td>
                  <td>Total</td>
                </tr> 
              </thead>
              <template v-for="[dateStr, row] in Object.entries(rows_daily)">
                <tbody>
                  <tr>
                    <td>{{ formatDay(dateStr) }}</td>
                    <td>{{ formatMoney(row) }}</td>
                  </tr> 
                </tbody>
              </template>
            </table>
          </article>
      </details>
    </div>
  `
}).mount('#app')

