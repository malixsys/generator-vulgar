'use strict';
var yeoman = require('yeoman-generator'),
     chalk = require('chalk'),
     yosay = require('yosay'),
         _ = require('lodash'),
         s = require('underscore.string'),
        fs = require('fs'),
    prompt = require('../../lib/option-or-prompt.js');

module.exports = yeoman.generators.Base.extend({

  _prompt: prompt,

  // The name `constructor` is important here
  constructor: function () {
    // Calling the super constructor is important so our generator is correctly set up
    yeoman.generators.Base.apply(this, arguments);

    // This method adds support for a `--vulgarcli` flag
    this.option('vulgarcli', { type: Boolean, defaults: false, hide: true });

    // This method adds support for a `--route-name` flag
    this.option('name', { type: String, alias:'n'});

    // This method adds support for a `--route-path` flag
    this.option('path', { type: String, alias:'p'});
  },

  askForModuleName: function () {

    var done = this.async();

    // Use custom prompt function which skips the prompt if
    // an option has been passed in
    this._prompt([{
      type: 'input',
      name: 'name',
      message: 'What would you like to name this component?',
      default: ''
    }], function(props) {
      this.props = props;
      // To access props later use this.props.someOption;

      this.moduleName = this.props.name;
      this.name = this.props.name;

      this.slugifiedName = s(this.name).humanize().slugify().value();
      this.classifiedName = s(this.slugifiedName).classify().value();
      this.humanizedName = s(this.slugifiedName).humanize().value();
      this.camelizedName = s(this.slugifiedName).camelize().value();
      this.decapitalizedName = s(this.name).humanize().decapitalize().value();

      this.destination = 'src/app/' + this.decapitalizedName + '/';

      done();
    }.bind(this));
  },

  askForRouteDetails: function() {

    var done = this.async();

    this._prompt([{
      type: 'input',
      name: 'path',
      message: 'What would you like the route path to be?',
      default: this.slugifiedName
    }], function(props) {

        this.props = props;
        // To access props later use this.props.someOption;

        this.path = this.props.path;

        this.slugifiedRoutePath = s(this.path).slugify().value();
        done();
    }.bind(this));
  },

  writing: function () {

    //** Generate `root` component
    this.fs.copyTpl(
      this.templatePath('components/_-root.component.ts'),
      this.destinationPath(this.destination + this.slugifiedName + '-root.component.ts'), {

        classifiedName: this.classifiedName,
        routePath: this.path,
        humanizedName: this.humanizedName,
        slugifiedName: this.slugifiedName
      }
    );

    //** Generate `list` component
    this.fs.copyTpl(
      this.templatePath('components/list/_-list.component.ts'),
      this.destinationPath(this.destination + this.slugifiedName + '-list.component.ts'), {

        classifiedName: this.classifiedName,
        humanizedName: this.humanizedName,
        slugifiedName: this.slugifiedName,
        camelizedName: this.camelizedName
      }
    );

    //** Generate `list` unit test
    this.fs.copyTpl(
      this.templatePath('components/list/_-list.component.spec.ts'),
      this.destinationPath(this.destination + this.slugifiedName + '-list.component.spec.ts'), {

        classifiedName: this.classifiedName,
        humanizedName: this.humanizedName,
        slugifiedName: this.slugifiedName
      }
    );

    //** Generate `list` template
    this.fs.copyTpl(
      this.templatePath('components/list/_-list.component.html'),
      this.destinationPath(this.destination + this.slugifiedName + '-list.component.html'), {

        classifiedName: this.classifiedName,
        camelizedName: this.camelizedName
      }
    );

    //** Generate `list` styles
    this.fs.copy(
      this.templatePath('components/list/_-list.component.scss'),
      this.destinationPath(this.destination + this.slugifiedName + '-list.component.scss')
    );

    //** Generate `detail` component
    this.fs.copyTpl(
      this.templatePath('components/detail/_-detail.component.ts'),
      this.destinationPath(this.destination + this.slugifiedName + '-detail.component.ts'), {

        classifiedName: this.classifiedName,
        humanizedName: this.humanizedName,
        slugifiedName: this.slugifiedName,
        camelizedName: this.camelizedName
      }
    );

    //** Generate `detail` unit test
    this.fs.copyTpl(
      this.templatePath('components/detail/_-detail.component.spec.ts'),
      this.destinationPath(this.destination + this.slugifiedName + '-detail.component.spec.ts'), {

        classifiedName: this.classifiedName,
        humanizedName: this.humanizedName,
        slugifiedName: this.slugifiedName
      }
    );

    //** Generate `detail` template
    this.fs.copyTpl(
      this.templatePath('components/detail/_-detail.component.html'),
      this.destinationPath(this.destination + this.slugifiedName + '-detail.component.html'), {

        classifiedName: this.classifiedName,
        camelizedName: this.camelizedName
      }
    );

    //** Generate `detail` styles
    this.fs.copy(
      this.templatePath('components/detail/_-detail.component.scss'),
      this.destinationPath(this.destination + this.slugifiedName + '-detail.component.scss')
    );

    //** Generate `Angular` service
    this.fs.copyTpl(
      this.templatePath('services/_.service.ts'),
      this.destinationPath(this.destination + this.slugifiedName + '.service.ts'), {

        classifiedName: this.classifiedName
      }
    );

    //** Generate `Angular` service unit test
    this.fs.copyTpl(
      this.templatePath('services/_.service.spec.ts'),
      this.destinationPath(this.destination + this.slugifiedName + '.service.spec.ts'), {

        classifiedName: this.classifiedName,
        slugifiedName: this.slugifiedName,
        humanizedName: this.humanizedName,
        camelizedName: this.camelizedName
      }
    );
  },

  end: function() {

    if(!this.options.vulgarcli) {
      // Terminate process if run from console
      process.exit(0);
    } else if(this.options.vulgarcli === true) {
      // `return 0` to let `vulgar-cli` know everything went okay on our end
      return 0;
    }
  }
});