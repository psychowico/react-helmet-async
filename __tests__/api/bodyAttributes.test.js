import React from 'react';
import ReactDOM from 'react-dom';
import Helmet from '../../src';
import Provider from '../../src/Provider';
import { HELMET_ATTRIBUTE, HTML_TAG_MAP } from '../../src/constants';

Helmet.defaultProps.defer = false;

const mount = document.getElementById('mount');

const render = node => {
  ReactDOM.render(<Provider>{node}</Provider>, mount);
};

describe('body attributes', () => {
  describe('valid attributes', () => {
    const attributeList = {
      accessKey: 'c',
      className: 'test',
      contentEditable: 'true',
      contextMenu: 'mymenu',
      'data-animal-type': 'lion',
      dir: 'rtl',
      draggable: 'true',
      dropzone: 'copy',
      hidden: 'true',
      id: 'test',
      lang: 'fr',
      spellcheck: 'true',
      style: 'color:green',
      tabIndex: '-1',
      title: 'test',
      translate: 'no',
    };

    Object.keys(attributeList).forEach(attribute => {
      it(attribute, () => {
        const attrValue = attributeList[attribute];

        const attr = {
          [attribute]: attrValue,
        };

        render(
          <Helmet>
            <body {...attr} />
          </Helmet>
        );

        const bodyTag = document.body;

        const reactCompatAttr = HTML_TAG_MAP[attribute] || attribute;
        expect(bodyTag.getAttribute(reactCompatAttr)).toEqual(attrValue);
        expect(bodyTag.getAttribute(HELMET_ATTRIBUTE)).toEqual(reactCompatAttr);
      });
    });
  });

  it('updates multiple body attributes', () => {
    render(
      <Helmet>
        <body className="myClassName" tabIndex={-1} />
      </Helmet>
    );

    const bodyTag = document.body;

    expect(bodyTag.getAttribute('class')).toEqual('myClassName');
    expect(bodyTag.getAttribute('tabindex')).toEqual('-1');
    expect(bodyTag.getAttribute(HELMET_ATTRIBUTE)).toEqual('class,tabindex');
  });

  it('sets attributes based on the deepest nested component', () => {
    render(
      <div>
        <Helmet>
          <body lang="en" />
        </Helmet>
        <Helmet>
          <body lang="ja" />
        </Helmet>
      </div>
    );

    const bodyTag = document.body;

    expect(bodyTag.getAttribute('lang')).toEqual('ja');
    expect(bodyTag.getAttribute(HELMET_ATTRIBUTE)).toEqual('lang');
  });

  it('handles valueless attributes', () => {
    render(
      <Helmet>
        <body hidden />
      </Helmet>
    );

    const bodyTag = document.body;

    expect(bodyTag.getAttribute('hidden')).toEqual('true');
    expect(bodyTag.getAttribute(HELMET_ATTRIBUTE)).toEqual('hidden');
  });

  it('clears body attributes that are handled within helmet', () => {
    render(
      <Helmet>
        <body lang="en" hidden />
      </Helmet>
    );

    render(<Helmet />);

    const bodyTag = document.body;

    expect(bodyTag.getAttribute('lang')).toBeNull();
    expect(bodyTag.getAttribute('hidden')).toBeNull();
    expect(bodyTag.getAttribute(HELMET_ATTRIBUTE)).toBeNull();
  });

  it('updates with multiple additions and removals - overwrite and new', () => {
    render(
      <Helmet>
        <body lang="en" hidden />
      </Helmet>
    );

    render(
      <Helmet>
        <body lang="ja" id="body-tag" title="body tag" />
      </Helmet>
    );

    const bodyTag = document.body;

    expect(bodyTag.getAttribute('hidden')).toBeNull();
    expect(bodyTag.getAttribute('lang')).toEqual('ja');
    expect(bodyTag.getAttribute('id')).toEqual('body-tag');
    expect(bodyTag.getAttribute('title')).toEqual('body tag');
    expect(bodyTag.getAttribute(HELMET_ATTRIBUTE)).toEqual('lang,id,title');
  });

  it('updates with multiple additions and removals - all new', () => {
    render(
      <Helmet>
        <body lang="en" hidden />
      </Helmet>
    );

    render(
      <Helmet>
        <body id="body-tag" title="body tag" />
      </Helmet>
    );

    const bodyTag = document.body;

    expect(bodyTag.getAttribute('hidden')).toBeNull();
    expect(bodyTag.getAttribute('lang')).toBeNull();
    expect(bodyTag.getAttribute('id')).toEqual('body-tag');
    expect(bodyTag.getAttribute('title')).toEqual('body tag');
    expect(bodyTag.getAttribute(HELMET_ATTRIBUTE)).toEqual('id,title');
  });

  describe('initialized outside of helmet', () => {
    beforeEach(() => {
      const bodyTag = document.body;
      bodyTag.setAttribute('test', 'test');
    });

    it('attributes are not cleared', () => {
      render(<Helmet />);

      const bodyTag = document.body;

      expect(bodyTag.getAttribute('test')).toEqual('test');
      expect(bodyTag.getAttribute(HELMET_ATTRIBUTE)).toBeNull();
    });

    it('attributes are overwritten if specified in helmet', () => {
      render(
        <Helmet>
          <body test="helmet-attr" />
        </Helmet>
      );

      const bodyTag = document.body;

      expect(bodyTag.getAttribute('test')).toEqual('helmet-attr');
      expect(bodyTag.getAttribute(HELMET_ATTRIBUTE)).toEqual('test');
    });

    it('attributes are cleared once managed in helmet', () => {
      render(
        <Helmet>
          <body test="helmet-attr" />
        </Helmet>
      );

      render(<Helmet />);

      const bodyTag = document.body;

      expect(bodyTag.getAttribute('test')).toBeNull();
      expect(bodyTag.getAttribute(HELMET_ATTRIBUTE)).toBeNull();
    });
  });
});