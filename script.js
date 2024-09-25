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
      dateRangeFrom: null,
      dateRangeTo: null,
    }
  },
  watch: {
    dateRange: function (newVal, oldVal) {
      this.handleFile()
    }
  },
  computed: {
    dateRange: function() {
      // This was added to prevent two properties from triggering this.handleFile() which results in a bug that computes values twice
      return this.dateRangeTo + this.dateRangeFrom;
    }
  },
  methods: {
    handleCSVLineByLine: function (results) {
      let row = results.data
      if (this.first || row.length < 4 || !row[3]) {
        this.first = false
        return
      }

      let currentDate = row[0] || this.prevDate
      if (currentDate != this.prevDate) {
        this.prevDate = currentDate
      }
      row[0] = currentDate

      if (
        (this.dateRangeFrom && (new Date(currentDate)).getTime() < (new Date(this.dateRangeFrom)).getTime())
        || (this.dateRangeTo && (new Date(currentDate)).getTime() > (new Date(this.dateRangeTo + ' 23:59:59')).getTime())
      ) return;

      let price = Number(row[3].trim().replaceAll(',', ''))
      let currentMonth = currentDate == 'UPCOMING' ? currentDate : currentDate.slice(0,7);

      this.rows_daily[currentDate] =  (this.rows_daily[currentDate] || 0) + price;
      this.rows_monthly[currentMonth] = (this.rows_monthly[currentMonth] || 0) + price

      let category = row[4] || 'UNKNOWN'
      // Remove surrounding spaces, uppercase, and remove double spaces from category
      category = category.trim().toUpperCase().replace(/ +(?= )/g,'')
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
    handleFile: function () {
      this.first = true
      this.rows_daily = {}
      this.rows_monthly = {}
      this.rows_categorical = {}

      let csvFile = document.getElementById('csv-file')
      const file = csvFile.files[0] 
      if (!file || this.processing) return;
      Papa.parse(file, {
        delimiter: ',',
        newline: '\n',
        comments: true,
        step: this.handleCSVLineByLine,
        before: () => this.processing = true,
        complete: () => this.processing = false,
        skipEmptyLines: true,
      })
    },
    clearDateRanges: function () {
      this.dateRangeFrom = null
      this.dateRangeTo = null
    }
  },
  mounted() {
    let csvFile = document.getElementById('csv-file')

    csvFile.addEventListener('change', this.handleFile);
    this.dateRangeTo = new Date().toISOString().substring(0, 10)

  },
  template: "#app-template"

}).mount('#app')

