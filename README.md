# Enhancement of Jobby App

This project is an enhancement of the existing Jobby App. The application allows users to log in, navigate between routes, retrieve job data, and handle errors.

The enhancement adds location-based job filtering along with sticky behavior for the Jobs page sidebar and application header.

## Enhancement Functionalities

### Location-Based Filter

Location checkboxes are added to the Jobs route for the following locations:

- Hyderabad
- Bangalore
- Chennai
- Delhi
- Mumbai

When one or more locations are selected, jobs corresponding to the selected locations are displayed.

The location filter works together with the existing:

- Type of Employment filter
- Salary Range filter

## Sticky Sidebar

The sidebar in the Jobs route is made sticky and contains:

- Type of Employment filters
- Salary Range filters
- Location filters

## Sticky Header

The header is made sticky across all routes to provide consistent navigation while scrolling.

## Technologies Used

- React.js
- JavaScript
- CSS

## Getting Started

Clone the repository:

```bash
git clone https://github.com/CS32567/jobby-app.git