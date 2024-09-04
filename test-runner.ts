import { run } from 'node:test';
import { spec } from 'node:test/reporters';
import { readdir } from 'node:fs/promises';
import { createWriteStream } from 'node:fs';
import { join } from 'node:path';

async function getFiles(): Promise<string[]> {
    const base = __dirname;
    const dir = join(base, 'test');
    const files = await readdir(dir, { recursive: true });
    return files.filter((file) => /\.(test|spec)\.[cm]?[jt]s$/u.test(file)).map((file) => join(dir, file));
}

void (async (): Promise<void> => {
    const stream = run({
        files: await getFiles(),
    });

    stream.on('test:fail', () => {
        process.exitCode = 1;
    });

    stream.compose(spec).pipe(process.stdout);

    if (process.env['CI'] === 'true' && process.env['GITHUB_ACTIONS'] === 'true') {
        const { default: ghaReporter } = await import('node-reporter-gha');
        stream.compose(ghaReporter).pipe(process.stdout);
    }

    if (process.env['SONARSCANNER'] === 'true') {
        const { default: sonarReporter } = await import('node-reporter-sonarqube');
        const testReportStream = createWriteStream('test-report.xml');
        stream.compose(sonarReporter).pipe(testReportStream);
    }
})();
