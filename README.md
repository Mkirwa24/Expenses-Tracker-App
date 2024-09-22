# Expenses-Tracker-App

# Expense Tracker Application

## Overview

The Expense Tracker Application is a user-friendly web-based tool that helps individuals keep track of their personal expenses. The application provides a simple interface to log, monitor, and analyze expenses, making it easier for users to manage their money efficiently. With intuitive dashboard features, users can quickly see their total expenses, view detailed charts, and manage individual transactions.

## Features

### Dashboard Menu

- **View Charts**:  Visualize your spending habits through various chart formats. This feature helps in understanding where the money goes and spotting trends in expenses over time.
- **View Expenses**: Get a detailed list of all recorded expenses. Users can see each transaction, categorized by type and date.
- **Add Expenses**: Easily log new expenses by entering details such as amount, category, date, and description. This helps in keeping track of all expenditures.
- **About Us**: Learn more about the Expense Tracker Application and the vision behind the project.

### Dashboard Overview

- **Total Expenses**: The dashboard automatically calculates and displays the total amount spent. This gives users a quick snapshot of their current spending status.
- **Charts and Graphs**: Visual representations of spending patterns are accessible directly from the dashboard, making it easy to analyze finances at a glance.

### Expense Management

- **Edit Expense**: Users can update the details of any recorded expense. This ensures that the expense records are accurate and up-to-date.
- **Delete Expense**: Remove any incorrect or unwanted entries from the expense list. This helps maintain the accuracy and relevancy of financial records.

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript for a responsive and interactive user interface.
- **Backend**: Node.js, Express.js for server-side operations and handling API requests.
- **Database**: MySQL for storing user data, expenses, and other related information.
- **Authentication**: JWT (JSON Web Tokens) for secure login and session management.

## Installation

To set up the Expense Tracker Application locally, follow these steps:

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/yourusername/Expenses-Tracker-App.git
    ```

2. **Navigate to the Project Directory**:
    ```bash
    cd Expenses-Tracker-App
    ```

3. **Install Dependencies**:
    ```bash
    npm install
    ```

4. **Set Up Environment Variables**: Create a `.env` file in the root directory with the following variables:

    ```env
    PORT=3000
    DB_HOST=your_db_host
    DB_USER=your_db_user
    DB_PASSWORD=your_db_password
    DB_NAME=your_db_name
    JWT_SECRET=your_jwt_secret
    ```

5. **Run Database Migrations**:
    ```bash
    npx sequelize db:migrate
    ```

6. **Start the Application**:
    ```bash
    npm start
    ```

7. **Access the Application**: Open a web browser and navigate to for example if using port 3000   navigate `http://localhost:3000`.

## Usage

1. **Register or Login**: Create an account or log in to access the application features.
2. **Add Expenses**: Use the 'Add Expenses' menu option to log new transactions. Enter details such as the amount, category, date, and description.
3. **View Expenses**: Go to the 'View Expenses' section to see a list of all recorded expenses. Use the edit and delete options to manage entries.
4. **View Charts**: Analyze your spending through charts available in the 'View Charts' section. These visual tools help understand your financial behavior.
5. **Total Expenses**: Check the dashboard for the automatically calculated total expenses, giving you an overview of your current financial state.
6. **About Us**: Visit the 'About Us' section to learn more about the application.

## Future Enhancements
- **Budgets**- implement a budgets sections
- **Recurring Transactions**: Implement functionality to handle recurring expenses and income entries.
- **Advanced Reporting**: Develop detailed reporting features for monthly and yearly spending analysis.
- **Notifications**: Add features to notify users about budget limits and important financial reminders.
- **Mobile App**: Create a mobile-friendly version for on-the-go expense tracking.




