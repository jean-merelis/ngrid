import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { createTestApp, getFileContent } from '../../utils/testing';
import { Schema } from './schema';

describe('material-table-schematic', () => {
  let runner: SchematicTestRunner;

  const baseOptions: Schema = {
    name: 'foo',
    project: 'material',
  };

  beforeEach(() => {
    runner = new SchematicTestRunner('schematics', require.resolve('../../collection.json'));
  });

  it('should create table files and add them to module', async () => {
    const app = await createTestApp(runner);
    const tree = await runner.runSchematicAsync('grid', baseOptions, app).toPromise();
    const files = tree.files;

    expect(files).toContain('/projects/material/src/app/foo/foo.component.css');
    expect(files).toContain('/projects/material/src/app/foo/foo.component.html');
    expect(files).toContain('/projects/material/src/app/foo/foo.component.spec.ts');
    expect(files).toContain('/projects/material/src/app/foo/foo.component.ts');

    const moduleContent = getFileContent(tree, '/projects/material/src/app/app.module.ts');
    expect(moduleContent).toMatch(/import.*Foo.*from '.\/foo\/foo.component'/);
    expect(moduleContent).toMatch(/declarations:\s*\[[^\]]+?,\r?\n\s+FooComponent\r?\n/m);

    const componentContent =
        getFileContent(tree, '/projects/material/src/app/foo/foo.component.ts');

    expect(componentContent).toContain('FooItem');
  });

  it('should add grid imports to module', async () => {
    const app = await createTestApp(runner);
    const tree = await runner.runSchematicAsync('grid', baseOptions, app).toPromise();
    const moduleContent = getFileContent(tree, '/projects/material/src/app/app.module.ts');

    expect(moduleContent).toContain('PblNgridModule');

    expect(moduleContent).toContain(`import { PblNgridModule } from '@pebula/ngrid';`);
  });

  it('should throw if no name has been specified', async () => {
    const appTree = await createTestApp(runner);
    expect.assertions(1);
    try {
      await runner.runSchematicAsync('grid', {project: 'material'}, appTree).toPromise();
    } catch (e) {
      expect(e).toMatch(/required property 'name'/);
    }
  });

  describe('style option', () => {
    it('should respect the option value', async () => {
      const tree = await runner.runSchematicAsync('grid', {style: 'scss', ...baseOptions}, await createTestApp(runner)).toPromise();
      expect(tree.files).toContain('/projects/material/src/app/foo/foo.component.scss');
    });

    it('should fall back to the @schematics/angular:component option value', async () => {
      const tree =
          await runner
              .runSchematicAsync('grid', baseOptions, await createTestApp(runner, {style: 'less'}))
              .toPromise();

      expect(tree.files).toContain('/projects/material/src/app/foo/foo.component.less');
    });
  });

  describe('inlineStyle option', () => {
    it('should respect the option value', async () => {
      const tree =
          await runner
              .runSchematicAsync(
                  'grid', {inlineStyle: true, ...baseOptions}, await createTestApp(runner))
              .toPromise();

      expect(tree.files).not.toContain('/projects/material/src/app/foo/foo.component.css');
    });

    it('should fall back to the @schematics/angular:component option value', async () => {
      const tree = await runner
                       .runSchematicAsync(
                           'grid', baseOptions, await createTestApp(runner, {inlineStyle: true}))
                       .toPromise();

      expect(tree.files).not.toContain('/projects/material/src/app/foo/foo.component.css');
    });
  });

  describe('inlineTemplate option', () => {
    it('should respect the option value', async () => {
      const tree =
          await runner
              .runSchematicAsync(
                  'grid', {inlineTemplate: true, ...baseOptions}, await createTestApp(runner))
              .toPromise();

      expect(tree.files).not.toContain('/projects/material/src/app/foo/foo.component.html');
    });

    it('should fall back to the @schematics/angular:component option value', async () => {
      const tree =
          await runner
              .runSchematicAsync(
                  'grid', baseOptions, await createTestApp(runner, {inlineTemplate: true}))
              .toPromise();

      expect(tree.files).not.toContain('/projects/material/src/app/foo/foo.component.html');
    });
  });

  describe('skipTests option', () => {
    it('should respect the option value', async () => {
      const tree = await runner
                       .runSchematicAsync(
                           'table', {skipTests: true, ...baseOptions}, await createTestApp(runner))
                       .toPromise();

      expect(tree.files).not.toContain('/projects/material/src/app/foo/foo.component.spec.ts');
    });

    it('should fall back to the @schematics/angular:component option value', async () => {
      const tree = await runner
                       .runSchematicAsync(
                           'grid', baseOptions, await createTestApp(runner, {skipTests: true}))
                       .toPromise();

      expect(tree.files).not.toContain('/projects/material/src/app/foo/foo.component.spec.ts');
    });
  });
});
