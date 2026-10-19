import { fireEvent, render, screen } from '@testing-library/react-native';
import { expect, it } from '@jest/globals';
import { ThirdPartyNotices } from '@/components/third-party-notices';
import notices from '@/legal/third-party-notices.json';

it('opens bundled terms on demand, exposes expansion state and unmounts closed license text', async () => {
  await render(<ThirdPartyNotices />);
  const first = notices[0];
  const second = notices[1];
  expect(screen.queryByText(first.text)).toBeNull();
  expect(screen.getByRole('button', { name: 'Open-source licenses', expanded: false })).toBeTruthy();
  await fireEvent.press(screen.getByRole('button', { name: 'Open-source licenses' }));
  const label = (index: number) => `${notices[index].credits[0].name}${notices[index].credits.length > 1 ? ` + ${notices[index].credits.length - 1} more` : ''}`;
  await fireEvent.press(screen.getByRole('button', { name: `Read license for ${label(0)}` }));
  expect(screen.getByText(first.text)).toBeTruthy();
  expect(screen.getByRole('button', { name: `Hide license for ${label(0)}`, expanded: true })).toBeTruthy();
  await fireEvent.press(screen.getByRole('button', { name: `Read license for ${label(1)}` }));
  expect(screen.queryByText(first.text)).toBeNull();
  expect(screen.getByText(second.text)).toBeTruthy();
  await fireEvent.press(screen.getByRole('button', { name: 'Close open-source licenses' }));
  expect(screen.queryByText(second.text)).toBeNull();
  await fireEvent.press(screen.getByRole('button', { name: 'Open-source licenses' }));
  expect(screen.queryByText(second.text)).toBeNull();
});
