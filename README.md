# resultstack-erino


GitHub User Search App
Overview
The GitHub User Search App is a web application designed to allow users to search for GitHub users by name or email. It leverages the GitHub REST API to fetch user details and display them in a paginated, user-friendly interface. This tool is particularly useful for recruiters, hiring managers, and developers who need to quickly view details about potential programming candidates on GitHub.

Features
Real-time Search:

As users type into the search bar, the app fetches relevant GitHub profiles dynamically, displaying matching results without needing to reload the page.
Pagination:

The results are paginated, displaying 5 users per page. Users can navigate between pages using the "Next" and "Previous" buttons, allowing them to browse large result sets efficiently.
User Information on Hover:

For each GitHub user in the search results, additional profile details (such as location, email, public repositories, account creation date, and last update timestamp) are displayed when hovering over the result, enhancing user experience by providing details without cluttering the interface.
Responsive Design:

The app is styled to be mobile-friendly and adjusts smoothly to different screen sizes, making it accessible from both desktop and mobile devices.
Glowing Navigation Bar:

The search bar has a subtle glowing animation to draw the user’s attention. This glow effect stops when the search bar is hovered over, providing a dynamic yet unobtrusive visual cue.
Technologies Used
Frontend Framework: Next.js (React)
API: GitHub REST API v3
Styling: Custom CSS, utilizing animations and responsive layouts
State Management: React hooks (useState and useEffect)
Version Control: Git
Hosting Platform: Vercel
Technical Details
GitHub API Integration:

The app utilizes the GitHub REST API’s /search/users endpoint to fetch users based on the search query. For each user, additional details are fetched from the /users/{username} endpoint to populate the hover card with comprehensive profile information.
Pagination Logic:

A page state variable controls the pagination, with each page displaying up to 5 results. The "Next" and "Previous" buttons allow navigation through pages, and the buttons are disabled when the beginning or end of the results is reached.
Hover-activated Detail Card:

For each user in the search results, a hover-activated card displays further details, such as their name, email, location, public repositories count, and account creation/last update timestamps.
Responsive and Accessible Design:

The app’s layout is optimized for mobile and desktop screens, with dynamic width adjustments for search and results sections. The glowing search bar is created with CSS animations, giving the app a visually engaging yet professional appearance.