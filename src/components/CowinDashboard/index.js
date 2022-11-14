// Write your code here
import './index.css'
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByAge from '../VaccinationByAge'
import VaccinationByGender from '../VaccinationByGender'

const apiConstants = {
  loading: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class CowinDashboard extends Component {
  state = {vaccinationList: [], apiStatus: apiConstants.loading}

  componentDidMount() {
    this.getVaccinationData()
  }

  getVaccinationData = async () => {
    const url = 'https://apis.ccbp.in/covid-vaccination-data'

    const response = await fetch(url)
    console.log(response)
    if (response.ok === true) {
      const data = await response.json()
      console.log(data)
      const updatedData = {
        last7DaysVaccination: data.last_7_days_vaccination.map(eachData => ({
          vaccinationDate: eachData.vaccination_date,
          dose1: eachData.dose_1,
          dose2: eachData.dose_2,
        })),
        vaccinationByAge: data.vaccination_by_age,
        vaccinationByGender: data.vaccination_by_gender,
      }
      console.log(updatedData)
      this.setState({
        vaccinationList: updatedData,
        apiStatus: apiConstants.success,
      })
    } else {
      this.setState({apiStatus: apiConstants.failure})
    }
  }

  renderSuccessView = () => {
    const {vaccinationList} = this.state
    const {
      last7DaysVaccination,
      vaccinationByAge,
      vaccinationByGender,
    } = vaccinationList
    return (
      <div className="dashboardContainer">
        <div className="headingContainer">
          <img
            className="websiteLogo"
            src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
            alt="website logo"
          />
          <h1 className="heading">Co-WIN</h1>
        </div>
        <div className="chartsContainer">
          <h1 className="vaccinationTitle">CoWIN Vaccination in India</h1>
          <VaccinationCoverage last7DaysVaccination={last7DaysVaccination} />
          <VaccinationByGender vaccinationByGender={vaccinationByGender} />
          <VaccinationByAge vaccinationByAge={vaccinationByAge} />
        </div>
      </div>
    )
  }

  renderFailureView = () => (
    <div className="dashboardContainer">
      <div className="headingContainer">
        <img
          className="websiteLogo"
          src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
          alt="website logo"
        />
        <h1 className="heading">Co-WIN</h1>
      </div>
      <div className="chartsContainer">
        <h1 className="vaccinationTitle">CoWIN Vaccination in India</h1>
        <div className="failureContainer">
          <img
            className="failureView"
            alt="failure view"
            src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
          />
          <h1 className="failureText">Something went wrong</h1>
        </div>
      </div>
    </div>
  )

  renderLoadingView = () => (
    <div className="dashboardContainer">
      <div className="headingContainer">
        <img
          className="websiteLogo"
          src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
          alt="website logo"
        />
        <h1 className="heading">Co-WIN</h1>
      </div>
      <div className="chartsContainerLoading">
        <div className="loadingLogo" testid="loader">
          <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
        </div>
      </div>
    </div>
  )

  render() {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiConstants.success:
        return this.renderSuccessView()
      case apiConstants.failure:
        return this.renderFailureView()
      case apiConstants.loading:
        return this.renderLoadingView()
      default:
        return null
    }
  }
}

export default CowinDashboard
