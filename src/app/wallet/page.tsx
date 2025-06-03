"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { ArrowDownIcon, ArrowUpIcon, SearchIcon, PlusIcon, XIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import Main from "@/components/ui/main"
import { useAuth } from "@/apis/apiCalls"
import Loading from "@/components/ui/loading"
import { CURRENCY } from "@/constants/constantValues"
import {
  useWalletCredit,
  useCustomerTransactions,
  useInitPaymentGateway
} from "@/apis/apiCalls"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Transaction } from "@/types/wallet-types"
import { AddToWalletData } from "@/apis/api-request-types"
import { PaymentGatewayDialog } from "@/components/common/payment-gateway-dialog"

const WalletPage = () => {
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddMoneyOpen, setIsAddMoneyOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [comment, setComment] = useState("Added to wallet");
  const [paymentUrl, setPaymentUrl] = useState("");
  const { user } = useAuth();
  const { toast } = useToast();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Use the wallet credit query hook
  const {
    data: walletData,
    isLoading: isBalanceLoading,
    refetch: refreshWalletBalance,
  } = useWalletCredit();

  // Use the transactions query hook
  const {
    data: transactionsData,
    isLoading: isTransactionsLoading,
    refetch: refreshTransactions,
  } = useCustomerTransactions();

  // Use the payment gateway mutation hook
  const paymentGatewayMutation = useInitPaymentGateway();
  const isLoading = paymentGatewayMutation.isPending;

  
  // Register event listener to handle postMessage from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Optional: check event.origin here for added security
      if (event.data === "close") {
        handlePaymentClose();
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);
    const handlePaymentClose = useCallback(() => {
      setIsPaymentOpen(false);
      setPaymentUrl("");
      // Refresh data after payment
      refreshWalletBalance();
      refreshTransactions();
      toast({
        title: "Payment Closed",
        description:
          "Your payment session has ended. If your payment was successful, funds will be added to your wallet shortly.",
      });
    }, [refreshWalletBalance, refreshTransactions, toast]);

  
  // Get transactions directly from API response
  const transactions = transactionsData?.records || [];

  // Calculate balance from API
  const walletBalance = walletData?.amount ? walletData.amount : 0;

  // Calculate credited and debited amounts
  const calculateCredited = (items: Transaction[]): number => {
    if (items.length === 0) return 0;
    return items
      .filter((t) => parseFloat(t.amount) > 0)
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
  };

  const calculateDebited = (items: Transaction[]): number => {
    if (items.length === 0) return 0;
    return Math.abs(
      items
        .filter((t) => parseFloat(t.amount) < 0)
        .reduce((sum, t) => sum + parseFloat(t.amount), 0),
    );
  };

  // Filter transactions
  const filteredTransactions = transactions.filter((transaction) => {
    const transactionAmount = parseFloat(transaction.amount);
    if (filter === "credited" && transactionAmount <= 0) return false;
    if (filter === "debited" && transactionAmount > 0) return false;
    if (
      searchQuery &&
      !transaction.comment.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "OMR",
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(date);
  };

  // Handle adding money to wallet
  const handleAddMoney = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount greater than 0",
        variant: "destructive",
      });
      return;
    }

    try {
      const paymentData: AddToWalletData = {
        amount: amount,
        payment_method_id: "1", // Default payment method
        comment: comment,
        order_total_amount: parseFloat(amount), // Using same amount as total
        action: "add_to_wallet",
      };

      const result = await paymentGatewayMutation.mutateAsync(paymentData);

      if (!result.error && result.pay_url) {
        // Open the payment URL in the dialog
        setPaymentUrl(result.pay_url);
        setIsAddMoneyOpen(false);
        setIsPaymentOpen(true);
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to initialize payment",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error initiating payment:", error);
      toast({
        title: "Error",
        description:
          error?.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };


  // Improved message handler with origin check
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      console.log("Received message:", event.data); // Debugging log

      // Optional: Verify the event origin matches your payment gateway
      // if (event.origin !== "https://your-payment-gateway.com") return;

      // Handle both string and object-style messages
      if (event.data === "close" || event.data?.action === "close") {
        console.log("Closing payment dialog");
        handlePaymentClose();
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [handlePaymentClose]); // Add handlePaymentClose as dependency

  if (!user) return <Loading />;

  return (
    <Main>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">My Wallet</h1>

          {/* Payment Gateway Dialog */}
          <PaymentGatewayDialog
            isOpen={isPaymentOpen}
            onOpenChange={(open) => {
              if (!open) {
                handlePaymentClose();
              } else {
                setIsPaymentOpen(true);
              }
            }}
            paymentUrl={paymentUrl}
            handlePaymentClose={handlePaymentClose}
            title="Complete Your Payment"
          />
        </div>

        {/* Balance Card */}
        <Card className="w-full bg-gradient-to-r from-[#1D0D25] to-[#673086] text-white">
          <CardHeader>
            <CardDescription className="text-white/80">
              Current Balance
            </CardDescription>
            <CardTitle className="text-4xl font-bold">
              {isBalanceLoading ? (
                <div className="h-9 w-32 animate-pulse rounded bg-white/20"></div>
              ) : (
                <span>
                  {CURRENCY} {walletBalance}
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col justify-between gap-4 sm:flex-row">
              <div className="flex items-center gap-2">
                <ArrowUpIcon className="h-5 w-5 text-green-300" />
                <span>Credited</span>
                <span className="font-semibold">
                  {`${CURRENCY} ${calculateCredited(transactions)}`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <ArrowDownIcon className="h-5 w-5 text-red-300" />
                <span>Debited</span>
                <span className="font-semibold">
                  {`${CURRENCY} ${calculateDebited(transactions)}`}
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Dialog open={isAddMoneyOpen} onOpenChange={setIsAddMoneyOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <PlusIcon className="h-4 w-4" />
                  Add Money
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-xl border-none shadow-lg sm:max-w-[425px]">
                <DialogHeader className="space-y-3 pb-2">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <PlusIcon className="h-6 w-6 text-primary" />
                  </div>
                  <DialogTitle className="text-center text-xl">
                    Add Money to Wallet
                  </DialogTitle>
                  <DialogDescription className="text-center text-sm">
                    Enter the amount you want to add to your wallet. You&apos;ll
                    be redirected to a payment gateway to complete the
                    transaction.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-6">
                  <div className="grid gap-3">
                    <Label htmlFor="amount" className="text-sm font-medium">
                      Amount
                    </Label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span className="text-muted-foreground">
                          {CURRENCY}
                        </span>
                      </div>
                      <Input
                        id="amount"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        min="1"
                        className="pl-14 text-lg font-medium"
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter className="flex flex-col gap-2 sm:flex-row">
                  <Button
                    variant="outline"
                    onClick={() => setIsAddMoneyOpen(false)}
                    className="w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddMoney}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-violet-500 to-purple-500 transition-all duration-300 hover:from-violet-600 hover:to-purple-600 sm:w-auto"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <svg
                          className="-ml-1 mr-2 h-4 w-4 animate-spin text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      "Add Money"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>

        {/* Transactions Section */}
        <Card>
          <CardHeader>
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <CardTitle>Transactions</CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative w-full sm:w-auto">
                  <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search transactions..."
                    className="w-full pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="credited">Credited</SelectItem>
                    <SelectItem value="debited">Debited</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="credited">Credited</TabsTrigger>
                <TabsTrigger value="debited">Debited</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="space-y-4">
                {isTransactionsLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between rounded-lg border p-4"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 animate-pulse rounded-full bg-primary/10" />
                          <div className="space-y-2">
                            <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                            <div className="h-3 w-24 animate-pulse rounded bg-muted" />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-16 animate-pulse rounded bg-muted" />
                          <div className="h-4 w-20 animate-pulse rounded bg-muted" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filteredTransactions.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">
                    No transactions found
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredTransactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-lg">
                            💰
                          </div>
                          <div>
                            <div className="font-medium">
                              {transaction.comment}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {formatDate(transaction.created_at)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              parseFloat(transaction.amount) > 0
                                ? "outline"
                                : "secondary"
                            }
                            className={
                              parseFloat(transaction.amount) > 0
                                ? "bg-green-50 text-green-600"
                                : "bg-red-50 text-red-600"
                            }
                          >
                            {parseFloat(transaction.amount) > 0
                              ? "Credited"
                              : "Debited"}
                          </Badge>
                          <span
                            className={`font-semibold ${parseFloat(transaction.amount) > 0 ? "text-green-600" : "text-red-600"}`}
                          >
                            {parseFloat(transaction.amount) > 0 ? "+" : ""}
                            {`${CURRENCY} ${Math.abs(parseFloat(transaction.amount)).toFixed(2)}`}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
              <TabsContent value="credited" className="space-y-4">
                {isTransactionsLoading ? (
                  <div className="space-y-4">
                    {[1, 2].map((i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between rounded-lg border p-4"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 animate-pulse rounded-full bg-primary/10" />
                          <div className="space-y-2">
                            <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                            <div className="h-3 w-24 animate-pulse rounded bg-muted" />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-16 animate-pulse rounded bg-muted" />
                          <div className="h-4 w-20 animate-pulse rounded bg-muted" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : transactions.filter((t) => parseFloat(t.amount) > 0)
                    .length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">
                    No credited transactions found
                  </div>
                ) : (
                  <div className="space-y-4">
                    {transactions
                      .filter((t) => parseFloat(t.amount) > 0)
                      .map((transaction) => (
                        <div
                          key={transaction.id}
                          className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-lg">
                              💰
                            </div>
                            <div>
                              <div className="font-medium">
                                {transaction.comment}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {formatDate(transaction.created_at)}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className="bg-green-50 text-green-600"
                            >
                              Credited
                            </Badge>
                            <span className="font-semibold text-green-600">
                              +
                              {`${CURRENCY} ${parseFloat(transaction.amount).toFixed(2)}`}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </TabsContent>
              <TabsContent value="debited" className="space-y-4">
                {isTransactionsLoading ? (
                  <div className="space-y-4">
                    {[1, 2].map((i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between rounded-lg border p-4"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 animate-pulse rounded-full bg-primary/10" />
                          <div className="space-y-2">
                            <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                            <div className="h-3 w-24 animate-pulse rounded bg-muted" />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-16 animate-pulse rounded bg-muted" />
                          <div className="h-4 w-20 animate-pulse rounded bg-muted" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : transactions.filter((t) => parseFloat(t.amount) < 0)
                    .length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">
                    No debited transactions found
                  </div>
                ) : (
                  <div className="space-y-4">
                    {transactions
                      .filter((t) => parseFloat(t.amount) < 0)
                      .map((transaction) => (
                        <div
                          key={transaction.id}
                          className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-lg">
                              💰
                            </div>
                            <div>
                              <div className="font-medium">
                                {transaction.comment}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {formatDate(transaction.created_at)}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="secondary"
                              className="bg-red-50 text-red-600"
                            >
                              Debited
                            </Badge>
                            <span className="font-semibold text-red-600">
                              {`${CURRENCY} ${Math.abs(parseFloat(transaction.amount)).toFixed(2)}`}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button variant="outline" onClick={() => refreshTransactions()}>
              Refresh Transactions
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Main>
  );
}

export default WalletPage
