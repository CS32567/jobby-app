import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'
import {Link} from 'react-router-dom'
import Header from '../Header'
import './index.css'

const employmentTypesList = [
  {label: 'Full Time', employmentTypeId: 'FULLTIME'},
  {label: 'Part Time', employmentTypeId: 'PARTTIME'},
  {label: 'Freelance', employmentTypeId: 'FREELANCE'},
  {label: 'Internship', employmentTypeId: 'INTERNSHIP'},
]

const salaryRangesList = [
  {salaryRangeId: '1000000', label: '10 LPA and above'},
  {salaryRangeId: '2000000', label: '20 LPA and above'},
  {salaryRangeId: '3000000', label: '30 LPA and above'},
  {salaryRangeId: '4000000', label: '40 LPA and above'},
]

const locationsList = [
  {locationId: 'Hyderabad', label: 'Hyderabad'},
  {locationId: 'Bangalore', label: 'Bangalore'},
  {locationId: 'Chennai', label: 'Chennai'},
  {locationId: 'Delhi', label: 'Delhi'},
  {locationId: 'Mumbai', label: 'Mumbai'},
]

class Jobs extends Component {
  state = {
    profileData: {},
    jobsList: [],
    filteredJobsList: [],
    searchInput: '',
    employmentType: [],
    salaryRange: '',
    selectedLocations: [],
    isProfileLoading: true,
    isJobsLoading: true,
    profileError: false,
    jobsError: false,
  }

  componentDidMount() {
    this.getProfile()
    this.getJobs()
  }

  getProfile = async () => {
    this.setState({isProfileLoading: true, profileError: false})

    const jwtToken = Cookies.get('jwt_token')

    const response = await fetch('https://apis.ccbp.in/profile', {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    })

    if (response.ok) {
      const data = await response.json()

      this.setState({
        profileData: data.profile_details,
        isProfileLoading: false,
      })
    } else {
      this.setState({
        profileError: true,
        isProfileLoading: false,
      })
    }
  }

  getJobs = async () => {
    this.setState({
      isJobsLoading: true,
      jobsError: false,
    })

    const {employmentType, salaryRange, searchInput} = this.state

    const jwtToken = Cookies.get('jwt_token')

    const employmentString = employmentType.join(',')

    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentString}&minimum_package=${salaryRange}&search=${searchInput}`

    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    })

    if (response.ok) {
      const data = await response.json()

      this.setState(
        {
          jobsList: data.jobs,
          isJobsLoading: false,
        },
        this.filterJobsByLocation,
      )
    } else {
      this.setState({
        jobsError: true,
        isJobsLoading: false,
      })
    }
  }

  filterJobsByLocation = () => {
    const {jobsList, selectedLocations} = this.state

    if (selectedLocations.length === 0) {
      this.setState({
        filteredJobsList: jobsList,
      })
    } else {
      const updatedJobsList = jobsList.filter(job =>
        selectedLocations.includes(job.location),
      )

      this.setState({
        filteredJobsList: updatedJobsList,
      })
    }
  }

  onSearchChange = event => {
    this.setState({
      searchInput: event.target.value,
    })
  }

  onSearchClick = () => {
    this.getJobs()
  }

  onEmploymentChange = id => {
    const {employmentType} = this.state

    const updatedList = employmentType.includes(id)
      ? employmentType.filter(each => each !== id)
      : [...employmentType, id]

    this.setState(
      {
        employmentType: updatedList,
      },
      this.getJobs,
    )
  }

  onSalaryChange = id => {
    this.setState(
      {
        salaryRange: id,
      },
      this.getJobs,
    )
  }

  onLocationChange = location => {
    const {selectedLocations} = this.state

    const updatedLocations = selectedLocations.includes(location)
      ? selectedLocations.filter(each => each !== location)
      : [...selectedLocations, location]

    this.setState(
      {
        selectedLocations: updatedLocations,
      },
      this.filterJobsByLocation,
    )
  }

  renderProfile() {
    const {profileData, isProfileLoading, profileError} = this.state

    if (isProfileLoading) {
      return (
        <div className="loader-container" data-testid="loader">
          <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
        </div>
      )
    }

    if (profileError) {
      return (
        <div className="profile-failure-container">
          <button
            type="button"
            className="retry-button"
            onClick={this.getProfile}
          >
            Retry
          </button>
        </div>
      )
    }

    return (
      <div className="profile-container">
        <img
          src={profileData.profile_image_url}
          alt="profile"
          className="profile-image"
        />
        <h1 className="profile-name">{profileData.name}</h1>
        <p className="profile-bio">{profileData.short_bio}</p>
      </div>
    )
  }

  renderJobs() {
    const {filteredJobsList, isJobsLoading, jobsError} = this.state

    if (isJobsLoading) {
      return (
        <div className="jobs-loader-container" data-testid="loader">
          <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
        </div>
      )
    }

    if (jobsError) {
      return (
        <div className="failure-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
            alt="failure view"
            className="failure-image"
          />

          <h1 className="failure-heading">Oops! Something Went Wrong</h1>

          <p className="failure-description">
            We cannot seem to find the page you are looking for
          </p>

          <button type="button" className="retry-button" onClick={this.getJobs}>
            Retry
          </button>
        </div>
      )
    }

    if (filteredJobsList.length === 0) {
      return (
        <div className="no-jobs-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
            alt="no jobs"
            className="no-jobs-image"
          />

          <h1 className="no-jobs-heading">No Jobs Found</h1>

          <p className="no-jobs-description">
            We could not find any jobs. Try other filters
          </p>
        </div>
      )
    }

    return (
      <ul className="jobs-list">
        {filteredJobsList.map(job => (
          <li key={job.id} className="job-item">
            <Link to={`/jobs/${job.id}`} className="job-link">
              <div className="company-details">
                <img
                  src={job.company_logo_url}
                  alt="company logo"
                  className="company-logo"
                />

                <div>
                  <h1 className="job-title">{job.title}</h1>
                  <p className="rating">⭐ {job.rating}</p>
                </div>
              </div>

              <div className="job-details-row">
                <div className="location-employment">
                  <p className="job-location">📍 {job.location}</p>
                  <p className="employment-type">💼 {job.employment_type}</p>
                </div>

                <p className="package">{job.package_per_annum}</p>
              </div>

              <hr className="job-divider" />

              <h1 className="description-heading">Description</h1>

              <p className="job-description">{job.job_description}</p>
            </Link>
          </li>
        ))}
      </ul>
    )
  }

  render() {
    const {searchInput, selectedLocations} = this.state

    return (
      <>
        <Header />

        <div className="jobs-page">
          <aside className="filters-sidebar">
            {this.renderProfile()}

            <hr className="filter-divider" />

            <h1 className="filter-heading">Type of Employment</h1>

            <ul className="filter-list">
              {employmentTypesList.map(item => (
                <li key={item.employmentTypeId} className="filter-item">
                  <input
                    type="checkbox"
                    id={item.employmentTypeId}
                    onChange={() =>
                      this.onEmploymentChange(item.employmentTypeId)
                    }
                  />

                  <label htmlFor={item.employmentTypeId}>{item.label}</label>
                </li>
              ))}
            </ul>

            <hr className="filter-divider" />

            <h1 className="filter-heading">Salary Range</h1>

            <ul className="filter-list">
              {salaryRangesList.map(item => (
                <li key={item.salaryRangeId} className="filter-item">
                  <input
                    type="radio"
                    name="salary"
                    id={item.salaryRangeId}
                    onChange={() => this.onSalaryChange(item.salaryRangeId)}
                  />

                  <label htmlFor={item.salaryRangeId}>{item.label}</label>
                </li>
              ))}
            </ul>

            <hr className="filter-divider" />

            <h1 className="filter-heading">Locations</h1>

            <ul className="filter-list">
              {locationsList.map(item => (
                <li key={item.locationId} className="filter-item">
                  <input
                    type="checkbox"
                    id={item.locationId}
                    checked={selectedLocations.includes(item.locationId)}
                    onChange={() => this.onLocationChange(item.locationId)}
                  />

                  <label htmlFor={item.locationId}>{item.label}</label>
                </li>
              ))}
            </ul>
          </aside>

          <main className="jobs-content">
            <div className="search-container">
              <input
                type="search"
                value={searchInput}
                onChange={this.onSearchChange}
                placeholder="Search"
                className="search-input"
              />

              <button
                type="button"
                data-testid="searchButton"
                onClick={this.onSearchClick}
                className="search-button"
              >
                <BsSearch />
              </button>
            </div>

            {this.renderJobs()}
          </main>
        </div>
      </>
    )
  }
}

export default Jobs
