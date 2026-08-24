import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsBoxArrowUpRight} from 'react-icons/bs'
import Header from '../Header'

class JobItemDetails extends Component {
  state = {
    jobData: {},
    similarJobs: [],
    isLoading: true,
    isError: false,
  }

  componentDidMount() {
    this.getJobDetails()
  }

  getJobDetails = async () => {
    this.setState({isLoading: true, isError: false})

    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {id} = match.params

    const response = await fetch(`https://apis.ccbp.in/jobs/${id}`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    })

    if (response.ok) {
      const data = await response.json()

      this.setState({
        jobData: data.job_details,
        similarJobs: data.similar_jobs,
        isLoading: false,
      })
    } else {
      this.setState({isError: true, isLoading: false})
    }
  }

  renderLoader = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button type="button" onClick={this.getJobDetails}>
        Retry
      </button>
    </div>
  )

  renderJobDetails = () => {
    const {jobData, similarJobs} = this.state

    return (
      <div>
        {/* Main Job Details */}
        <div>
          <img src={jobData.company_logo_url} alt="job details company logo" />
          <h1>{jobData.title}</h1>
          <p>{jobData.rating}</p>
          <p>{jobData.location}</p>
          <p>{jobData.employment_type}</p>
          <p>{jobData.package_per_annum}</p>

          <h1>Description</h1>
          <a
            href={jobData.company_website_url}
            target="_blank"
            rel="noreferrer"
          >
            Visit <BsBoxArrowUpRight />
          </a>
          <p>{jobData.job_description}</p>

          <h1>Skills</h1>
          <ul>
            {jobData.skills &&
              jobData.skills.map(skill => (
                <li key={skill.name}>
                  <img src={skill.image_url} alt={skill.name} />
                  <p>{skill.name}</p>
                </li>
              ))}
          </ul>

          <h1>Life at Company</h1>
          {jobData.life_at_company && (
            <>
              <p>{jobData.life_at_company.description}</p>
              <img
                src={jobData.life_at_company.image_url}
                alt="life at company"
              />
            </>
          )}
        </div>

        {/* Similar Jobs */}
        <h1>Similar Jobs</h1>
        <ul>
          {similarJobs.map(job => (
            <li key={job.id}>
              <img src={job.company_logo_url} alt="similar job company logo" />
              <h1>{job.title}</h1>
              <p>{job.rating}</p>
              <p>{job.location}</p>
              <p>{job.employment_type}</p>

              <h1>Description</h1>
              <p>{job.job_description}</p>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  render() {
    const {isLoading, isError} = this.state

    if (isLoading) {
      return (
        <>
          <Header />
          {this.renderLoader()}
        </>
      )
    }

    if (isError) {
      return (
        <>
          <Header />
          {this.renderFailureView()}
        </>
      )
    }

    return (
      <>
        <Header />
        {this.renderJobDetails()}
      </>
    )
  }
}

export default JobItemDetails
