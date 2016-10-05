import React from 'react';
import Interactive from 'antwar-interactive';
import Container from './Container';
import Sidebar from './Sidebar';
import Contributors from './Contributors';

export default ({ section, page }) => {
  let edit = `https://github.com/webpack/webpack.js.org/edit/master/content/${page.url}.md`;

  return (
    <Container className="page">
      <Interactive
        id="components/Sidebar.jsx"
        component={Sidebar}
        sectionName={section.name}
        pages={section.pages()}
      />

      <section className="page__content">
        <h1>{ page.title }</h1>

        <a className="page__edit" href={ edit }>
          Edit this Page&nbsp;&nbsp;
          <i className="icon-edit" />
        </a>

        <div dangerouslySetInnerHTML={{ __html: page.content }} />

        <hr />

        <Contributors contributors={ page.contributors } />
      </section>
    </Container>
  );
};
