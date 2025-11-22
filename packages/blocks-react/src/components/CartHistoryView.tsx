/**
 * Cart history view component
 */

import React from 'react';
import { useCartHistory } from '../hooks/useCartHistory';
import type { CartHistoryOptions, CartHistoryEntry } from '@vk/blocks-core';

export interface CartHistoryViewProps {
  /**
   * Custom class name
   */
  className?: string;
  
  /**
   * History options
   */
  historyOptions?: CartHistoryOptions;
  
  /**
   * On restore callback
   */
  onRestore?: (entry: CartHistoryEntry) => void;
  
  /**
   * Custom render for history entry
   */
  renderEntry?: (entry: CartHistoryEntry, onRestore: () => void, onRemove: () => void) => React.ReactNode;
  
  /**
   * Empty message
   */
  emptyMessage?: string;
  
  /**
   * Custom render for empty state
   */
  renderEmpty?: () => React.ReactNode;
  
  /**
   * Children (for custom content)
   */
  children?: React.ReactNode;
}

export function CartHistoryView({
  className,
  historyOptions,
  onRestore,
  renderEntry,
  emptyMessage = 'No cart history',
  renderEmpty,
  children,
}: CartHistoryViewProps) {
  const history = useCartHistory(historyOptions);

  const handleRestore = (entry: CartHistoryEntry) => {
    const restored = history.restoreState(entry.id);
    if (restored && onRestore) {
      onRestore(entry);
    }
  };

  if (children) {
    return <div className={`vkecom-cart-history ${className || ''}`}>{children}</div>;
  }

  if (history.entries.length === 0) {
    return (
      <div className={`vkecom-cart-history vkecom-cart-history-empty ${className || ''}`}>
        {renderEmpty ? renderEmpty() : <p>{emptyMessage}</p>}
      </div>
    );
  }

  return (
    <div className={`vkecom-cart-history ${className || ''}`}>
      <h3 className="vkecom-cart-history-title">Cart History</h3>
      <ul className="vkecom-cart-history-list" role="list">
        {history.entries.map((entry) => (
          <li key={entry.id} className="vkecom-cart-history-entry" role="listitem">
            {renderEntry ? (
              renderEntry(
                entry,
                () => handleRestore(entry),
                () => history.removeEntry(entry.id)
              )
            ) : (
              <div className="vkecom-cart-history-entry-content">
                <div className="vkecom-cart-history-entry-info">
                  {entry.label && <div className="vkecom-cart-history-entry-label">{entry.label}</div>}
                  <div className="vkecom-cart-history-entry-date">
                    {new Date(entry.timestamp).toLocaleString()}
                  </div>
                  <div className="vkecom-cart-history-entry-items">
                    {entry.state.itemCount} items - ${entry.state.total.toFixed(2)}
                  </div>
                </div>
                <div className="vkecom-cart-history-entry-actions">
                  <button
                    type="button"
                    onClick={() => handleRestore(entry)}
                    className="vkecom-cart-history-entry-restore"
                  >
                    Restore
                  </button>
                  <button
                    type="button"
                    onClick={() => history.removeEntry(entry.id)}
                    className="vkecom-cart-history-entry-remove"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

