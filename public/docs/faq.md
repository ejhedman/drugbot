# Drugissimo FAQ - User Guide

## Getting Started

### Q: What is Drugissimo?
**A:** Drugissimo is a comprehensive pharmaceutical database management system designed for pharmaceutical professionals. It helps you track and manage generic drugs, manufactured drugs, administration routes, regulatory approvals, and drug aliases in a single, organized platform.

### Q: How do I access Drugissimo?
**A:** 
1. Open your web browser and navigate to the Drugissimo application URL
2. You'll see a welcome screen with an overview of the application
3. Click the "Login" button in the header
4. Enter any valid email address (the system simulates authentication for demo purposes)
5. Click "Sign In" to access the application

### Q: What browsers are supported?
**A:** Drugissimo works best with modern browsers including:
- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

### Q: Is Drugissimo mobile-friendly?
**A:** Yes! Drugissimo is fully responsive and works on mobile devices, tablets, and desktop computers. The interface automatically adapts to your screen size.

## Authentication & Access

### Q: How do I log in to Drugissimo?
**A:** 
1. Click the "Login" button in the header
2. Enter any valid email address (e.g., `yourname@company.com`)
3. Click "Sign In"
4. You'll be automatically logged in and redirected to the main application

### Q: Why does Drugissimo accept any email address?
**A:** Drugissimo currently uses a simulated authentication system for demonstration purposes. In a production environment, this would be replaced with proper authentication using Supabase Auth or similar services.

### Q: How do I log out?
**A:** 
1. Click on your email address in the top-right corner of the header
2. Select "Sign Out" from the dropdown menu
3. You'll be logged out and returned to the welcome screen

### Q: I forgot my password - what should I do?
**A:** Since Drugissimo uses simulated authentication, you can simply enter any valid email address to log in. In a production environment, there would be a "Forgot Password" link that would send a password reset email.

## Navigation & Interface

### Q: How do I navigate the Drugissimo interface?
**A:** Drugissimo has a three-panel layout:
- **Left Panel (Entity Tree)**: Browse and search generic drugs
- **Center Panel**: View details of selected drugs
- **Right Panel**: Access related data in tabs (Routes, Approvals, Aliases, Manufactured Drugs)

### Q: How do I search for a specific drug?
**A:** 
1. Look for the search box in the left panel (Entity Tree)
2. Type the drug name, class, target, or any other property
3. Results will appear in real-time as you type
4. Click on a result to view its details

### Q: How do I expand/collapse the entity tree?
**A:** 
1. Click on any generic drug in the left panel
2. A chevron icon will appear next to the drug name
3. Click the chevron to expand and see manufactured drug variants
4. Click again to collapse

### Q: What are the different tabs in the detail view?
**A:** When you select a generic drug, you'll see four tabs:
- **Manufactured Drugs**: Brand names and biosimilars
- **Drug Route & Dosing**: Administration routes and dosing information
- **Drug Approval**: Regulatory approvals by country
- **Aliases**: Alternative names and references

## Working with Data

### Q: How do I add a new generic drug?
**A:** 
1. Click the "+" button in the left panel header
2. Fill out the form with the drug information:
   - **Display Name**: The generic drug name
   - **Generic Name**: Official generic name
   - **Biologic Classification**: Information about biologic status
   - **Mechanism of Action**: How the drug works
   - **Drug Class/Type**: Classification (Biologic, Small Molecule, etc.)
   - **Target**: Molecular target (e.g., TNFi, JAKi)
3. Click "Create Entity" to save

### Q: How do I add a manufactured drug variant?
**A:** 
1. Select a generic drug in the left panel
2. Expand the drug to see its manufactured variants
3. Click the "+" button next to the generic drug name
4. Fill out the form with:
   - **Display Name**: Brand name
   - **Brand Name**: Commercial name
   - **Manufacturer**: Pharmaceutical company
   - **Biosimilar**: Check if it's a biosimilar
   - **Biosimilar Suffix**: FDA suffix (e.g., -aacf)
   - **Biosimilar Originator**: Original brand name (for biosimilars)
5. Click "Create Child Entity" to save

### Q: How do I edit existing drug information?
**A:** 
1. Select the drug you want to edit
2. In the detail view, look for the "Edit" button
3. Make your changes in the form
4. Click "Save" to update the information
5. Click "Cancel" to discard changes

### Q: How do I delete a drug?
**A:** 
1. Select the drug you want to delete
2. Click the "Delete" button in the detail view
3. Confirm the deletion in the dialog box
4. The drug will be permanently removed from the database

**⚠️ Warning:** Deletion is permanent and cannot be undone. Make sure you want to delete the drug before confirming.

### Q: How do I add route and dosing information?
**A:** 
1. Select a generic drug
2. Click the "Drug Route & Dosing" tab
3. Click "Add New" to create a new route entry
4. Fill out the form with:
   - **Route Type**: Subcutaneous, Intravenous, or Oral
   - **Loading Dose**: Initial dosing amount
   - **Loading Dose Unit**: Unit of measurement (mg, ml, etc.)
   - **Maintenance Dose**: Ongoing dosing amount
   - **Maintenance Dose Unit**: Unit of measurement
   - **Monotherapy Status**: Approval status
   - **Half Life**: Drug elimination half-life
5. Click "Save" to add the route

### Q: How do I add approval information?
**A:** 
1. Select a generic drug
2. Click the "Drug Approval" tab
3. Click "Add New" to create a new approval entry
4. Fill out the form with:
   - **Country**: USA, CAN, FRA, or UK
   - **Indication**: Approved medical use
   - **Approval Date**: Date of regulatory approval
   - **Box Warning**: Safety warnings (if any)
5. Click "Save" to add the approval

### Q: How do I add drug aliases?
**A:** 
1. Select a generic drug
2. Click the "Aliases" tab
3. Click "Add New" to create a new alias
4. Enter the alternative name or reference
5. Click "Save" to add the alias

## Data Management

### Q: How do I export data from Drugissimo?
**A:** 
1. Click the "Export" button in the header (if available)
2. The system will generate an Excel file with all drug data
3. The file will automatically download to your computer
4. The Excel file will contain separate sheets for each data type

### Q: Can I import data into Drugissimo?
**A:** Currently, Drugissimo supports file uploads for Excel files, but the import functionality is being developed. You can upload files through the upload interface, but data processing is not yet fully implemented.

### Q: How do I search across all drug data?
**A:** 
1. Use the search box in the left panel
2. Type any search term (drug name, manufacturer, target, etc.)
3. Results will show matching drugs across all data types
4. Click on a result to view its full details

### Q: How do I filter data by specific criteria?
**A:** Currently, Drugissimo provides basic search functionality. Advanced filtering options are planned for future releases and will include filtering by:
- Drug class/type
- Target
- Country of approval
- Manufacturer
- Biosimilar status

## Understanding the Data

### Q: What is the difference between generic drugs and manufactured drugs?
**A:** 
- **Generic Drugs**: The base pharmaceutical compound (e.g., "adalimumab")
- **Manufactured Drugs**: Commercial versions of generic drugs (e.g., "Humira", "Amjevita")

### Q: What are biosimilars?
**A:** Biosimilars are highly similar versions of biologic drugs that are approved after the original biologic's patent expires. They have the same mechanism of action but may have different brand names and FDA suffixes (e.g., -aacf, -aqvh).

### Q: What do the different route types mean?
**A:** 
- **Subcutaneous**: Injected under the skin
- **Intravenous**: Injected directly into a vein
- **Oral**: Taken by mouth

### Q: What are box warnings?
**A:** Box warnings (also called "black box warnings") are the most serious warnings required by the FDA. They appear in a black box on drug labels and indicate significant risks associated with the drug.

### Q: What does "monotherapy" mean?
**A:** Monotherapy means the drug is approved to be used alone, without other medications. Some drugs are only approved when used in combination with other treatments.

## Troubleshooting

### Q: The application is loading slowly - what should I do?
**A:** 
1. Check your internet connection
2. Try refreshing the page
3. Clear your browser cache
4. Try a different browser
5. Contact support if the issue persists

### Q: I can't see any data - what's wrong?
**A:** 
1. Make sure you're logged in
2. Check if the database has been properly set up
3. Try refreshing the page
4. Look for any error messages in the browser console
5. Contact your system administrator

### Q: I'm getting an error message - what should I do?
**A:** 
1. Read the error message carefully
2. Try the action again
3. Check if you have the necessary permissions
4. Contact support with the exact error message

### Q: The search isn't working - what should I do?
**A:** 
1. Make sure you're typing in the correct search box
2. Try different search terms
3. Check if there are any special characters in your search
4. Try refreshing the page
5. Contact support if the issue persists

### Q: I can't edit a drug - why not?
**A:** 
1. Make sure you're logged in with appropriate permissions
2. Check if the drug is locked or in use by another user
3. Verify that you have edit permissions for that data type
4. Contact your system administrator if you need elevated permissions

## Advanced Features

### Q: How do I use keyboard shortcuts?
**A:** Drugissimo supports several keyboard shortcuts:
- **Tab**: Navigate between form fields
- **Enter**: Submit forms or select items
- **Escape**: Cancel dialogs or close modals
- **Ctrl/Cmd + F**: Focus on search box
- **Arrow Keys**: Navigate in lists and trees

### Q: How do I view drug relationships?
**A:** 
1. Select a generic drug in the left panel
2. Expand it to see manufactured drug variants
3. The relationship is shown in the tree structure
4. You can also see relationships in the detail tabs

### Q: How do I compare drugs?
**A:** Currently, Drugissimo doesn't have a built-in comparison feature. You can:
1. Open multiple browser tabs
2. Navigate to different drugs in each tab
3. Manually compare the information

A drug comparison feature is planned for future releases.

### Q: How do I track changes to drug data?
**A:** Currently, Drugissimo doesn't have built-in audit logging. Changes are saved immediately but not tracked. An audit trail feature is planned for future releases.

## Data Accuracy & Validation

### Q: How accurate is the drug data in Drugissimo?
**A:** The accuracy depends on the data source and how it's maintained. Drugissimo includes demo data for demonstration purposes. In production use, data accuracy should be verified against official sources like:
- FDA databases
- EMA databases
- Manufacturer websites
- Medical literature

### Q: How do I validate drug information?
**A:** 
1. Cross-reference with official regulatory databases
2. Check manufacturer websites
3. Consult medical literature
4. Verify with healthcare professionals
5. Use multiple sources to confirm information

### Q: What should I do if I find incorrect data?
**A:** 
1. Document the incorrect information
2. Research the correct information from reliable sources
3. Update the data in Drugissimo if you have edit permissions
4. Contact your system administrator if you need help
5. Consider adding a note about the correction

## Security & Privacy

### Q: Is my data secure in Drugissimo?
**A:** Drugissimo implements several security measures:
- Secure authentication (in production)
- Row-level security policies
- Input validation and sanitization
- HTTPS encryption for all data transmission
- Regular security updates

### Q: Who can access the drug data?
**A:** Access is controlled by:
- User authentication
- Role-based permissions
- Row-level security policies
- Approval workflows for sensitive changes

### Q: Is my personal information stored?
**A:** Drugissimo primarily stores drug-related data. Personal information is limited to:
- User authentication data (email, login history)
- User preferences and settings
- Audit logs of user actions

### Q: How is data backed up?
**A:** Data backup is handled by the Supabase platform:
- Automatic daily backups
- Point-in-time recovery
- Geographic redundancy
- Encrypted backup storage

## Getting Help

### Q: How do I get help with Drugissimo?
**A:** There are several ways to get help:
1. **Check this FAQ**: Look for answers to common questions
2. **Use the Help & Feedback feature**: Click the feedback button in the footer
3. **Contact your system administrator**: For technical issues
4. **Review the documentation**: Check the API and architecture documents
5. **Submit a bug report**: Use the feedback form with detailed information

### Q: How do I report a bug?
**A:** 
1. Click the "Help & Feedback" button in the footer
2. Select "Bug Report" as the feedback type
3. Provide detailed information:
   - What you were trying to do
   - What happened instead
   - Steps to reproduce the issue
   - Browser and operating system information
4. Submit the report

### Q: How do I request a new feature?
**A:** 
1. Click the "Help & Feedback" button in the footer
2. Select "Feature Request" as the feedback type
3. Describe the feature you'd like to see
4. Explain how it would help your workflow
5. Submit the request

### Q: Where can I find more detailed documentation?
**A:** Additional documentation is available:
- **API Documentation**: Technical details about the API
- **Architecture Document**: System design and technical architecture
- **Design Document**: UI/UX design principles and patterns
- **Database Schema**: Detailed database structure

## Future Features

### Q: What features are planned for future releases?
**A:** Planned features include:
- **Advanced Analytics**: Drug comparison and analysis tools
- **Data Visualization**: Charts and graphs for drug relationships
- **Mobile App**: Native mobile application
- **Integration APIs**: Connect with external databases
- **Audit Logging**: Comprehensive change tracking
- **Advanced Search**: More sophisticated filtering and search
- **Bulk Operations**: Import/export and batch processing
- **Real-time Collaboration**: Multi-user editing capabilities

### Q: How often is Drugissimo updated?
**A:** Update frequency depends on the deployment:
- **Development**: Frequent updates during active development
- **Production**: Regular updates with new features and bug fixes
- **Security**: Immediate updates for security issues

### Q: How do I stay informed about updates?
**A:** 
1. Check the release notes in the application
2. Contact your system administrator for update notifications
3. Watch for announcements in the application
4. Subscribe to update notifications if available

## Technical Questions

### Q: What technology is Drugissimo built with?
**A:** Drugissimo is built with modern web technologies:
- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Shadcn/ui components
- **Backend**: Next.js API routes, Supabase
- **Database**: PostgreSQL
- **Authentication**: Supabase Auth
- **Real-time**: Supabase real-time subscriptions

### Q: Can I integrate Drugissimo with other systems?
**A:** Drugissimo provides RESTful APIs that can be integrated with other systems. See the API documentation for technical details about available endpoints and data formats.

### Q: Is Drugissimo open source?
**A:** Drugissimo is built with open-source technologies, but the application itself may have proprietary components. Check with your system administrator for licensing details.

### Q: Can I run Drugissimo locally?
**A:** Yes, Drugissimo can be run locally for development purposes. See the main README for setup instructions and requirements.

---

## Quick Reference

### Keyboard Shortcuts
- **Tab**: Navigate form fields
- **Enter**: Submit/select
- **Escape**: Cancel/close
- **Ctrl/Cmd + F**: Search

### Common Actions
- **Add Drug**: Click "+" in entity tree
- **Edit Drug**: Click "Edit" in detail view
- **Delete Drug**: Click "Delete" in detail view
- **Search**: Use search box in left panel
- **Export**: Click export button (if available)

### Data Types
- **Generic Drugs**: Base pharmaceutical compounds
- **Manufactured Drugs**: Commercial versions
- **Routes**: Administration methods and dosing
- **Approvals**: Regulatory information
- **Aliases**: Alternative names

### Support Contacts
- **Technical Issues**: System administrator
- **Feature Requests**: Help & Feedback form
- **Bug Reports**: Help & Feedback form
- **General Questions**: This FAQ 