import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'
import {Link} from 'react-router-dom'
import Header from '../Header'

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

class Jobs extends Component {
  state = {
    profileData: {},
    jobsList: [],
    searchInput: '',
    employmentType: [],
    salaryRange: '',
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
      headers: {Authorization: `Bearer ${jwtToken}`},
    })

    if (response.ok) {
      const data = await response.json()
      this.setState({
        profileData: data.profile_details,
        isProfileLoading: false,
      })
    } else {
      this.setState({profileError: true, isProfileLoading: false})
    }
  }

  getJobs = async () => {
    this.setState({isJobsLoading: true, jobsError: false})

    const {employmentType, salaryRange, searchInput} = this.state
    const jwtToken = Cookies.get('jwt_token')

    const employmentString = employmentType.join(',')

    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentString}&minimum_package=${salaryRange}&search=${searchInput}`

    const response = await fetch(apiUrl, {
      headers: {Authorization: `Bearer ${jwtToken}`},
    })

    if (response.ok) {
      const data = await response.json()
      this.setState({
        jobsList: data.jobs,
        isJobsLoading: false,
      })
    } else {
      this.setState({jobsError: true, isJobsLoading: false})
    }
  }

  onSearchChange = event => {
    this.setState({searchInput: event.target.value})
  }

  onSearchClick = () => {
    this.getJobs()
  }

  onEmploymentChange = id => {
    const {employmentType} = this.state
    const updatedList = employmentType.includes(id)
      ? employmentType.filter(each => each !== id)
      : [...employmentType, id]

    this.setState({employmentType: updatedList}, this.getJobs)
  }

  onSalaryChange = id => {
    this.setState({salaryRange: id}, this.getJobs)
  }

  renderProfile() {
    const {profileData, isProfileLoading, profileError} = this.state

    if (isProfileLoading) {
      return (
        <div data-testid="loader">
          <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
        </div>
      )
    }

    if (profileError) {
      return (
        <div>
          <button type="button" onClick={this.getProfile}>
            Retry
          </button>
        </div>
      )
    }

    return (
      <div>
        <img src={profileData.profile_image_url} alt="profile" />
        <h1>{profileData.name}</h1>
        <p>{profileData.short_bio}</p>
      </div>
    )
  }

  renderJobs() {
    const {jobsList, isJobsLoading, jobsError} = this.state

    if (isJobsLoading) {
      return (
        <div data-testid="loader">
          <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
        </div>
      )
    }

    if (jobsError) {
      return (
        <div>
          <img
            src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
            alt="failure view"
          />
          <h1>Oops! Something Went Wrong</h1>
          <p>We cannot seem to find the page you are looking for</p>
          <button type="button" onClick={this.getJobs}>
            Retry
          </button>
        </div>
      )
    }

    if (jobsList.length === 0) {
      return (
        <div>
          <img
            src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
            alt="no jobs"
          />
          <h1>No Jobs Found</h1>
          <p>We could not find any jobs. Try other filters</p>
        </div>
      )
    }

    return (
      <ul>
        {jobsList.map(job => (
          <li key={job.id}>
            <Link to={`/jobs/${job.id}`}>
              <img src={job.company_logo_url} alt="company logo" />
              <h1>{job.title}</h1>
              <p>{job.rating}</p>
              <p>{job.location}</p>
              <p>{job.employment_type}</p>
              <p>{job.package_per_annum}</p>
              <h1>Description</h1>
              <p>{job.job_description}</p>
            </Link>
          </li>
        ))}
      </ul>
    )
  }

  render() {
    const {searchInput} = this.state

    return (
      <>
        <Header />
        <div>
          {this.renderProfile()}

          <h1>Type of Employment</h1>
          <ul>
            {employmentTypesList.map(item => (
              <li key={item.employmentTypeId}>
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

          <h1>Salary Range</h1>
          <ul>
            {salaryRangesList.map(item => (
              <li key={item.salaryRangeId}>
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

          <input
            type="search"
            value={searchInput}
            onChange={this.onSearchChange}
            placeholder="Search"
          />
          <button
            type="button"
            data-testid="searchButton"
            onClick={this.onSearchClick}
          >
            <BsSearch />
          </button>

          {this.renderJobs()}
        </div>
      </>
    )
  }
}

export default Jobs
