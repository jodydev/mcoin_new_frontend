import { parseUnits } from '@ethersproject/units'
import {
  CloseIcon,
  Heading,
  IconButton,
  InjectedModalProps,
  ModalBody,
  ModalContainer,
  ModalHeader as UIKitModalHeader,
  ModalTitle,
} from '@pancakeswap/uikit'
import { useAccount, useBalance } from 'wagmi'
import { useState, useCallback } from 'react'
import { useTranslation } from '@pancakeswap/localization'
import styled from 'styled-components'
import WalletInfo from './WalletInfo'
import WalletTransactions from './WalletTransactions'
import WalletWrongNetwork from './WalletWrongNetwork'

export enum WalletView {
  WALLET_INFO,
  TRANSACTIONS,
  WRONG_NETWORK,
}

interface WalletModalProps extends InjectedModalProps {
  initialView?: WalletView
}

export const LOW_NATIVE_BALANCE = parseUnits('0.002', 'ether')

const ModalHeader = styled(UIKitModalHeader)`
  // background: ${({ theme }) => theme.colors.gradientBubblegum};
`

// const Tabs = styled.div`
//   background-color: ${({ theme }) => theme.colors.dropdown};
//   border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
//   padding: 16px 24px;
// `

const Region = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: 8px;
  padding: 12px 12px 0px 12px;
  margin-bottom: 16px;
`

// interface TabsComponentProps {
//   view: WalletView
//   handleClick: (newIndex: number) => void
// }

// const TabsComponent: React.FC<React.PropsWithChildren<TabsComponentProps>> = ({ view, handleClick }) => {
//   const { t } = useTranslation()

//   return (
//     <Tabs>
//       <ButtonMenu scale="sm" variant="subtle" onItemClick={handleClick} activeIndex={view} fullWidth>
//         <ButtonMenuItem>{t('Wallet')}</ButtonMenuItem>
//         <ButtonMenuItem>{t('Transactions')}</ButtonMenuItem>
//       </ButtonMenu>
//     </Tabs>
//   )
// }

const WalletModal: React.FC<React.PropsWithChildren<WalletModalProps>> = ({
  initialView = WalletView.WALLET_INFO,
  onDismiss,
}) => {
  const [view, setView] = useState(initialView)
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const { data, isFetched } = useBalance({ address: account })
  const hasLowNativeBalance = isFetched && data && data.value.lte(LOW_NATIVE_BALANCE)

  const handleClick = useCallback((newIndex: number) => {
    setView(newIndex)
  }, [])

  return (
    <ModalContainer id="modal-wallet-info-box" title={t('Welcome!')} $minWidth="360px">
      <ModalHeader>
        <ModalTitle>
          <Heading>{t('Wallet')}</Heading>
        </ModalTitle>
        <IconButton scale="sm" variant="text" onClick={onDismiss}>
          <CloseIcon width="20px" color="text" />
        </IconButton>
      </ModalHeader>
      {/* {view !== WalletView.WRONG_NETWORK && <TabsComponent view={view} handleClick={handleClick} />} */}
      {/* <ModalBody p="24px" width="100%"> */}
      <div id='modal-wallet-info'>
        {view === WalletView.WALLET_INFO && (
          <>
            <Region>
              <WalletInfo hasLowNativeBalance={hasLowNativeBalance} switchView={handleClick} onDismiss={onDismiss} />
            </Region>
            <Region>
              <WalletTransactions onDismiss={onDismiss} />
            </Region>
          </>
        )}
        {/* {view === WalletView.TRANSACTIONS && <WalletTransactions onDismiss={onDismiss} />} */}
        {view === WalletView.WRONG_NETWORK && <WalletWrongNetwork onDismiss={onDismiss} />}
      </div>
    </ModalContainer>
  )
}

export default WalletModal
