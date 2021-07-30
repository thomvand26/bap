export const GoodbyeEmail = ({ locale }) => {
  return (
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>
          {locale === 'en' ? 'Account deleted' : 'Account verwijderd'}
        </title>
        <link
          href="https://fonts.googleapis.com/css2?family=Spartan:wght@400;700&display=swap"
          rel="stylesheet"
          type="text/css"
        />
      </head>
      <body
        style={{
          width: '100%',
          WebkitTextSizeAdjust: '100%',
          margin: 0,
          padding: 0,
        }}
      >
        <table
          cellPadding="0"
          cellSpacing="0"
          border="0"
          style={{ width: '100%', maxWidth: '100%', padding: '8%' }}
        >
          <tr>
            <td>
              <h1
                style={{
                  color: '#FF7700',
                  textAlign: 'center',
                  marginBottom: '1em',
                  marginTop: '100px',
                  fontFamily: "'Spartan', Verdana, sans-serif",
                  fontSize: '3em',
                }}
              >
                {process?.env?.NEXT_PUBLIC_APP_NAME}
              </h1>
              <h2
                style={{
                  color: '#202020',
                  textAlign: 'center',
                  marginBottom: '3em',
                  fontFamily: "'Spartan', Verdana, sans-serif",
                  fontSize: '1.75em',
                }}
              >
                {locale === 'en' ? 'Account deleted' : 'Account verwijderd'}
              </h2>
              <br />
              <p
                style={{
                  color: '#202020',
                  marginBottom: '2em',
                  fontFamily: "'Spartan', Verdana, sans-serif",
                  fontSize: '1.25em',
                  textAlign: 'center',
                }}
              >
                {locale === 'en' ? 'Your account has been successfully deleted.' : 'Jouw account is succesvol verwijderd.'} 
              </p>
              <p
                style={{
                  color: '#202020',
                  marginBottom: '3em',
                  fontFamily: "'Spartan', Verdana, sans-serif",
                  fontSize: '1.25em',
                  textAlign: 'center',
                }}
              >
                {locale === 'en' ? 'You can always create a new account.' : 'Je kan altijd een nieuw account aanmaken.'} 
              </p>
            </td>
          </tr>
          <tr>
            <td
              style={{
                padding: '1.5em',
                textAlign: 'center',
              }}
            >
              <a
                href={`${process?.env?.BASE_URL}/auth/register`}
                style={{
                  color: '#202020',
                  textDecoration: 'none',
                  textAlign: 'center',
                  fontFamily: "'Spartan', Verdana, sans-serif",
                  marginBottom: '100px',
                  fontSize: '1.25em',
                  fontWeight: 'bold',
                  borderRadius: '0.5em',
                  padding: '1.5em',
                  backgroundColor: '#FF9940',
                  whiteSpace: 'nowrap',
                }}
              >
                {locale === 'en' ? 'Create a new account' : 'Maak een nieuw account'} 
              </a>
            </td>
          </tr>
          <tr style={{ height: '100px' }}></tr>
        </table>
      </body>
    </html>
  );
};
