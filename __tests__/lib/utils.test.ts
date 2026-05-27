import { cn } from '@/lib/utils';

describe('lib/utils.ts', () => {
  describe('cn() - className merger', () => {
    it('should merge simple class names', () => {
      const result = cn('px-2', 'py-1');
      expect(result).toContain('px-2');
      expect(result).toContain('py-1');
    });

    it('should handle conditional classNames', () => {
      const isActive = true;
      const result = cn('base', isActive && 'active');
      expect(result).toContain('base');
      expect(result).toContain('active');
    });

    it('should handle conditional classNames with false condition', () => {
      const isActive = false;
      const result = cn('base', isActive && 'active');
      expect(result).toContain('base');
      expect(result).not.toContain('active');
    });

    it('should merge Tailwind CSS conflicts correctly', () => {
      const result = cn('px-2 px-4');
      // Later value should take precedence
      expect(result).toContain('px-4');
    });

    it('should handle array inputs', () => {
      const result = cn(['px-2', 'py-1']);
      expect(result).toContain('px-2');
      expect(result).toContain('py-1');
    });

    it('should handle empty inputs', () => {
      const result = cn('');
      expect(typeof result).toBe('string');
    });

    it('should handle undefined inputs', () => {
      const result = cn(undefined, 'px-2');
      expect(result).toContain('px-2');
    });

    it('should handle null inputs', () => {
      const result = cn(null, 'px-2');
      expect(result).toContain('px-2');
    });

    it('should handle object inputs', () => {
      const result = cn({ 'px-2': true, 'py-1': false });
      expect(result).toContain('px-2');
      expect(result).not.toContain('py-1');
    });

    it('should combine multiple complex inputs', () => {
      const result = cn(
        'base',
        ['array-item'],
        { 'conditional-true': true, 'conditional-false': false },
        'end'
      );
      expect(result).toContain('base');
      expect(result).toContain('array-item');
      expect(result).toContain('conditional-true');
      expect(result).not.toContain('conditional-false');
      expect(result).toContain('end');
    });
  });
});
