import React from 'react';

export default class MonthlyView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      monthClicked: true,
      currentMonth: null,
      monthlyTotal: 0,
      categoryNames: [],
      categoryTotals: [],
      categoryPercentages: []
    };
    this.handleMonthClick = this.handleMonthClick.bind(this);
    this.handleYearClick = this.handleYearClick.bind(this);
  }

  componentDidMount() {
    const currentMonth = this.getCurrentMonth();
    this.setState({ currentMonth });
    fetch('/api/entries/monthlyTotal')
      .then(res => res.json())
      .then(data => {
        this.setState({ monthlyTotal: parseFloat(data.monthlytotal) });
        return fetch('/api/entries/monthlyCategoryTotals');
      })
      .then(res => res.json())
      .then(data => {
        const categoryNames = Object.keys(data);
        const categoryTotals = Object.values(data);
        const categoryPercentages = this.calculateCategoryPercentages(categoryTotals, this.state.monthlyTotal);
        this.setState({ categoryNames, categoryTotals, categoryPercentages });
      })
      .catch(err => {
        // eslint-disable-next-line no-console
        console.log(err);
      });
  }

  getCurrentMonth() {
    const now = new Date();
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const monthIndex = now.getMonth();
    return monthNames[monthIndex];
  }

  handleMonthClick() {
    this.setState({ monthClicked: true });
  }

  handleYearClick() {
    this.setState({ monthClicked: false });
  }

  calculateCategoryPercentages(categoryTotals, monthlyTotal) {
    if (monthlyTotal === 0) {
      return categoryTotals.map(() => 0);
    }
    return categoryTotals.map(total => Number(total) / Number(monthlyTotal) * 300);
  }

  render() {
    const { currentMonth, monthlyTotal, categoryNames, categoryTotals, categoryPercentages } = this.state;
    const firstFourCategories = categoryNames.slice(0, 4);
    const lastFourCategories = categoryNames.slice(4);
    const firstFourTotals = categoryTotals.slice(0, 4);
    const lastFourTotals = categoryTotals.slice(4);
    const firstFourPercentages = categoryPercentages.slice(0, 4);
    const lastFourPercentages = categoryPercentages.slice(4);
    const commaMonthlyTotal = isNaN(monthlyTotal) ? '0' : monthlyTotal.toLocaleString(undefined, { useGrouping: true });

    return (
      <div className='body-sections'>
        <div className='one-third-card'>
          <div className='month-year-buttons'>
            <button
              className={`section-titles month-year-style ${this.state.monthClicked ? 'active-button' : 'inactive-button'}`}
              onClick={this.handleMonthClick}
            >
              This Month
            </button>
            <button
              className={`section-titles month-year-style ${this.state.monthClicked ? 'inactive-button' : 'active-button'}`}
              onClick={this.handleYearClick}
            >
              This year
            </button>
          </div>
          <div className='top-spending-container'>
            <div className='section-titles month-year-total'>
              {currentMonth} Spending
            </div>
            <div className='section-titles big-number'>
              ${commaMonthlyTotal}
            </div>
          </div>
        </div>
        <div className='monthly-pie-chart'>
          <div className='category-container'>
            <div className='section-titles'>Spending by Category</div>
            <div className='category-col-container'>
              <div className='category-col'>
                {firstFourCategories.map((categoryName, index) => (
                  <div key={categoryName} className='category-item'>
                    <div className='category-name-container'>
                      <div className='category-name'>{categoryName}</div>
                      <div className='category-bar' style={{ width: `${firstFourPercentages[index]}%` }} />
                    </div>
                    <div className='category-total'>
                      ${firstFourTotals[index]}
                    </div>
                  </div>
                ))}
              </div>
              <div className='category-col'>
                {lastFourCategories.map((categoryName, index) => (
                  <div key={categoryName} className='category-item'>
                    <div className='category-name-container'>
                      <div className='category-name'>{categoryName}</div>
                      <div className='bar-container'>
                        <div className='category-bar' style={{ width: `${lastFourPercentages[index]}%` }} />
                      </div>
                    </div>
                    <div className='category-total'>
                      ${lastFourTotals[index]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
